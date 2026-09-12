import { secrets } from 'base44:runtime';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const batchSize = 4;
const requestGapMs = 9000;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const assets = [
  { symbol: 'SPY', name: 'S&P 500 ETF', group: 'indices', currency: 'USD' },
  { symbol: 'QQQ', name: 'Nasdaq-100 ETF', group: 'indices', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'BTC/USD', name: 'Bitcoin', group: 'crypto', currency: 'USD' },
  { symbol: 'ETH/USD', name: 'Ethereum', group: 'crypto', currency: 'USD' },
  { symbol: 'USD/AED', name: 'US Dollar / UAE Dirham', group: 'forex', currency: 'AED' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', group: 'forex', currency: 'USD' },
  { symbol: 'AAPL', name: 'Apple', group: 'stocks', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA', group: 'stocks', exchange: 'NASDAQ', currency: 'USD' },
];

const toNumber = value => value == null || value === '' || !Number.isFinite(Number(value)) ? null : Number(value);

async function fetchQuote(asset, apiKey) {
  const params = new URLSearchParams({ symbol: asset.symbol, apikey: apiKey });
  if (asset.exchange) params.set('exchange', asset.exchange);
  if (asset.type) params.set('type', asset.type);
  if (asset.country) params.set('country', asset.country);
  try {
    const response = await fetch(`https://api.twelvedata.com/quote?${params}`, { signal: AbortSignal.timeout(8000) });
    const raw = await response.json();
    if (!response.ok || raw.status === 'error') {
      const code = Number(raw.code || response.status);
      return { error: raw.message || `Twelve Data error ${code}`, retryable: code === 429 || code >= 500 };
    }
    const price = toNumber(raw.close ?? raw.price);
    if (!(price > 0)) return { error: 'No valid price returned' };
    return {
      quote: {
        symbol: asset.symbol, name: asset.name, group: asset.group,
        exchange: asset.exchange || raw.exchange || null,
        currency: asset.unit || raw.currency || asset.currency || null,
        price, open: toNumber(raw.open), change: toNumber(raw.change),
        changePercent: toNumber(raw.percent_change), datetime: raw.datetime || null,
        isMarketOpen: typeof raw.is_market_open === 'boolean' ? raw.is_market_open : null,
        fetchedAt: new Date().toISOString(),
      },
    };
  } catch {
    return { error: 'Twelve Data could not be reached', retryable: true };
  }
}

export default async function(req) {
  try {
    const client = createClientFromRequest(req);
    const user = await client.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { batch = 0, force = false } = await req.json();
    if (!Number.isInteger(batch) || batch < 0 || batch >= Math.ceil(assets.length / batchSize)) return Response.json({ error: 'Invalid batch' }, { status: 400 });
    const store = client.asServiceRole.entities.MarketDataCache;
    let [state] = await store.filter({ key: 'twelve-data-v2' }, 'created_date', 1);
    if (!state) return Response.json({ error: 'Market cache is not initialized' }, { status: 500 });
    const apiKey = secrets.get('TWELVE_DATA_API_KEY');
    if (!apiKey) return Response.json({ error: 'TWELVE_DATA_API_KEY is not configured' }, { status: 500 });
    // A short cooldown also spaces requests between separate invocations.
    const cooldown = (state.lease_until || 0) - Date.now();
    if (cooldown > 0 && cooldown <= requestGapMs) {
      await sleep(cooldown);
      state = await store.get(state.id);
    }
    const now = Date.now();
    if (state.lease_until > now) return Response.json({ updated: 0, message: 'Another refresh is in progress; existing prices retained.' });
    const due = assets.slice(batch * batchSize, (batch + 1) * batchSize)
      .filter(asset => force || now - (state.attempts?.[asset.symbol] || 0) >= 9 * 60000);
    if (!due.length) return Response.json({ updated: 0, message: 'This batch was already refreshed.' });
    const day = new Date(now).toISOString().slice(0, 10);
    const used = state.budget_day === day ? state.credits_used || 0 : 0;
    const reservation = due.length * 2;
    if (used + reservation > 780) return Response.json({ updated: 0, message: 'Daily provider budget reached; all last-known prices retained.' });
    const token = crypto.randomUUID();
    await store.updateMany({ id: state.id, lease_token: state.lease_token, lease_until: state.lease_until }, { $set: {
      lease_token: token, lease_until: now + 180000, budget_day: day, credits_used: used + reservation,
    } });
    const locked = await store.get(state.id);
    if (locked.lease_token !== token) return Response.json({ updated: 0, message: 'Refresh already running.' });
    const quotes = { ...locked.quotes }, issues = { ...locked.issues }, attempts = { ...locked.attempts };
    let lastRequestAt = 0, requestCount = 0, successful = 0;
    for (const asset of due) {
      let response;
      for (let attempt = 0; attempt < 2; attempt++) {
        await sleep(Math.max(0, lastRequestAt + requestGapMs - Date.now()));
        lastRequestAt = Date.now();
        requestCount++;
        response = await fetchQuote(asset, apiKey);
        if (response.quote || !response.retryable) break;
      }
      attempts[asset.symbol] = Date.now();
      if (response.quote) {
        quotes[asset.symbol] = response.quote;
        issues[asset.symbol] = '';
        successful++;
      } else {
        issues[asset.symbol] = response.error;
      }
      // Save each success immediately. Failures never overwrite a price or its timestamp.
      await store.update(state.id, { quotes, issues, attempts });
    }
    await store.update(state.id, {
      credits_used: used + requestCount,
      lease_until: lastRequestAt + requestGapMs,
      message: successful === due.length ? '' : 'Some prices could not refresh; last-known real values remain visible.',
    });
    return Response.json({ updated: successful, attempted: due.map(a => a.symbol), requests: requestCount,
      stored: Object.keys(quotes), issues: Object.fromEntries(due.filter(a => issues[a.symbol]).map(a => [a.symbol, issues[a.symbol]])) });
  } catch (error) {
    return Response.json({ error: error.message || 'Scheduled market refresh failed' }, { status: 500 });
  }
}