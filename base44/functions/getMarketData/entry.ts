import { secrets } from 'base44:runtime';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const ttl = 5 * 60 * 1000;
const assets = [
  { symbol: 'BTC/USD', name: 'Bitcoin', group: 'crypto', currency: 'USD' },
  { symbol: 'ETH/USD', name: 'Ethereum', group: 'crypto', currency: 'USD' },
  { symbol: 'USD/AED', name: 'US Dollar / UAE Dirham', group: 'forex', currency: 'AED' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', group: 'forex', currency: 'USD' },
  { symbol: 'SPX', name: 'S&P 500', group: 'indices', type: 'Index', country: 'United States' },
  { symbol: 'IXIC', name: 'Nasdaq Composite', group: 'indices', type: 'Index', country: 'United States' },
  { symbol: 'FTSE', name: 'FTSE 100', group: 'indices', type: 'Index', country: 'United Kingdom' },
  { symbol: 'EMAAR', name: 'Emaar Properties', group: 'uae', exchange: 'DFM', currency: 'AED' },
  { symbol: 'FAB', name: 'First Abu Dhabi Bank', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'ADNOCDIST', name: 'ADNOC Distribution', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'DEWA', name: 'Dubai Electricity & Water Authority', group: 'uae', exchange: 'DFM', currency: 'AED' },
  { symbol: 'AAPL', name: 'Apple', group: 'stocks', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA', group: 'stocks', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'ADNOCGAS', name: 'ADNOC Gas', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'EMIRATESNBD', name: 'Emirates NBD', group: 'uae', exchange: 'DFM', currency: 'AED' },
  { symbol: 'ETISALAT', name: 'e& (Etisalat)', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'ALDAR', name: 'Aldar Properties', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'DIB', name: 'Dubai Islamic Bank', group: 'uae', exchange: 'DFM', currency: 'AED' },
];
const number = v => v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v);

function result(state, message = '', needsAuth = false) {
  const quotes = Object.fromEntries(Object.entries(state?.quotes || {}).map(([symbol, q]) => [symbol, { ...q, stale: Date.now() - Date.parse(q.fetchedAt) >= ttl || !!state?.issues?.[symbol] }]));
  const issues = { ...state?.issues };
  for (const a of assets) if (!quotes[a.symbol] && !issues[a.symbol]) issues[a.symbol] = 'Waiting for the next rate-limited refresh.';
  return { assets, quotes, issues, message: message || state?.message || '', needsAuth, cached: true, nextRefreshAt: state?.lease_until || 0 };
}

async function request(endpoint, asset, apiKey) {
  const params = new URLSearchParams({ symbol: asset.symbol, apikey: apiKey });
  for (const key of ['exchange', 'country', 'type']) if (asset[key]) params.set(key, asset[key]);
  try {
    const response = await fetch(`https://api.twelvedata.com/${endpoint}?${params}`, { signal: AbortSignal.timeout(8000) });
    const raw = await response.json();
    const code = Number(raw.code || response.status);
    if (!response.ok || raw.status === 'error') {
      if (code === 401) return { error: 'Twelve Data rejected the API key. Please check TWELVE_DATA_API_KEY.', fatal: true };
      if (code === 429) return { error: 'Twelve Data rate limit reached. Cached prices are shown where available.', rateLimited: true };
      if (code === 403 || code === 404 || code === 400) return { error: 'Unavailable on the connected Twelve Data plan or symbol coverage.', unavailable: true };
      return { error: 'Twelve Data is temporarily unavailable. Please retry later.' };
    }
    return { raw };
  } catch {
    return { error: 'Twelve Data could not be reached. Please retry later.' };
  }
}

async function fetchAsset(asset, apiKey) {
  const quoted = await request('quote', asset, apiKey);
  if (quoted.fatal || quoted.rateLimited || quoted.unavailable) return quoted;
  const raw = quoted.raw;
  // Never substitute a same-named stock/ETF for an index or a different exchange's listing.
  if (raw && ((asset.group === 'indices' && !/index/i.test(raw.type || '')) || (asset.exchange && raw.exchange?.toUpperCase() !== asset.exchange.toUpperCase()) || (asset.group === 'uae' && raw.currency !== 'AED'))) {
    return { error: 'The requested index or exchange listing is not available from this plan.', unavailable: true };
  }
  let price = number(raw?.close ?? raw?.price);
  // /price is a price-only fallback, not an extra call for every successful quote.
  if (!(price > 0) && asset.group !== 'indices') {
    const latest = await request('price', asset, apiKey);
    if (latest.error) return latest;
    price = number(latest.raw?.price);
  }
  if (!(price > 0)) return { error: 'No valid price was returned for this instrument.', unavailable: true };
  return { quote: { symbol: asset.symbol, name: asset.name, exchange: asset.exchange || raw?.exchange || null, currency: raw?.currency || asset.currency || null, price, open: number(raw?.open), change: number(raw?.change), changePercent: number(raw?.percent_change), datetime: raw?.datetime || null, isMarketOpen: typeof raw?.is_market_open === 'boolean' ? raw.is_market_open : null, fetchedAt: new Date().toISOString() } };
}

export default async function(req) {
  let state;
  try {
    const client = createClientFromRequest(req);
    const user = await client.auth.me().catch(() => null);
    [state] = await client.entities.MarketDataCache.filter({ key: 'twelve-data-v2' }, 'created_date', 1);
    if (!state) return Response.json(result(null, 'The shared market cache is not initialized. Please contact the app administrator.'));
    const apiKey = secrets.get('TWELVE_DATA_API_KEY');
    if (!apiKey) return Response.json(result(state, 'Market data is unavailable: TWELVE_DATA_API_KEY is not configured.'));
    // Public visitors may read market prices, but only signed-in users may trigger paid requests.
    if (!user) return Response.json(result(state, 'Sign in to refresh market prices. Cached quotes remain available.', true));
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const used = state.budget_day === day ? state.credits_used || 0 : 0;
    if (state.lease_until > now) return Response.json(result(state));
    if (used + 8 > 780) return Response.json(result(state, 'Daily market-data budget reached. Last known prices are shown until the next UTC day.'));
    const due = assets.filter(a => (state.attempts?.[a.symbol] || 0) <= now)
      .sort((a, b) => (state.attempts?.[a.symbol] || 0) - (state.attempts?.[b.symbol] || 0)).slice(0, 4);
    if (!due.length) return Response.json(result(state));
    const store = client.asServiceRole.entities.MarketDataCache;
    const token = crypto.randomUUID();
    // Atomic compare-and-set on a pre-seeded singleton: all workers/users share the budget.
    // Reserve eight credits BEFORE making calls, even if a worker later fails.
    // Four parallel quotes + at most four /price fallbacks; 80s spacing covers the 16s timeout window.
    await store.updateMany({ id: state.id, lease_token: state.lease_token, lease_until: state.lease_until }, { $set: { lease_token: token, lease_until: now + 80000, budget_day: day, credits_used: used + 8 } });
    const locked = await store.get(state.id);
    if (locked.lease_token !== token) return Response.json(result(locked));
    const responses = await Promise.all(due.map(a => fetchAsset(a, apiKey)));
    const quotes = { ...locked.quotes }, issues = { ...locked.issues }, attempts = { ...locked.attempts };
    let message = '';
    responses.forEach((response, i) => {
      const symbol = due[i].symbol;
      attempts[symbol] = Date.now() + (response.unavailable ? 86400000 : ttl);
      if (response.quote) { quotes[symbol] = response.quote; delete issues[symbol]; }
      else issues[symbol] = response.error;
      if (response.fatal || response.rateLimited) message = response.error;
    });
    const nextState = await store.update(state.id, { quotes, issues, attempts, message, ...(responses.some(r => r.fatal || r.rateLimited) ? { lease_until: Date.now() + ttl } : {}) });
    return Response.json(result(nextState));
  } catch {
    return Response.json(result(state, 'Market data could not be loaded. Please try again shortly; no simulated prices are shown.'));
  }
}