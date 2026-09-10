import { secrets } from 'base44:runtime';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const refreshIntervalMs = 10 * 60 * 1000;
const batchSize = 5;
const assets = [
  { symbol: 'SPY', name: 'S&P 500 ETF', group: 'indices', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'QQQ', name: 'Nasdaq-100 ETF', group: 'indices', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'BTC/USD', name: 'Bitcoin', group: 'crypto', currency: 'USD' },
  { symbol: 'ETH/USD', name: 'Ethereum', group: 'crypto', currency: 'USD' },
  { symbol: 'USD/AED', name: 'US Dollar / UAE Dirham', group: 'forex', currency: 'AED' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', group: 'forex', currency: 'USD' },
  { symbol: 'AAPL', name: 'Apple', group: 'stocks', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA', group: 'stocks', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'EMAAR', name: 'Emaar Properties', group: 'uae', exchange: 'DFM', currency: 'AED' },
  { symbol: 'FAB', name: 'First Abu Dhabi Bank', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'ADNOCDIST', name: 'ADNOC Distribution', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'DEWA', name: 'Dubai Electricity & Water Authority', group: 'uae', exchange: 'DFM', currency: 'AED' },
  { symbol: 'ADNOCGAS', name: 'ADNOC Gas', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'EMIRATESNBD', name: 'Emirates NBD', group: 'uae', exchange: 'DFM', currency: 'AED' },
  { symbol: 'ETISALAT', name: 'e& (Etisalat)', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'ALDAR', name: 'Aldar Properties', group: 'uae', exchange: 'ADX', currency: 'AED' },
  { symbol: 'DIB', name: 'Dubai Islamic Bank', group: 'uae', exchange: 'DFM', currency: 'AED' },
];

const toNumber = value => value == null || value === '' || !Number.isFinite(Number(value)) ? null : Number(value);

async function fetchQuote(asset, apiKey) {
  const params = new URLSearchParams({ symbol: asset.symbol, apikey: apiKey });
  if (asset.exchange) params.set('exchange', asset.exchange);
  try {
    const response = await fetch(`https://api.twelvedata.com/quote?${params}`, { signal: AbortSignal.timeout(8000) });
    const raw = await response.json();
    if (!response.ok || raw.status === 'error') return { error: raw.message || `Twelve Data error ${response.status}` };
    const price = toNumber(raw.close ?? raw.price);
    if (!(price > 0)) return { error: 'No valid price returned' };
    return {
      quote: {
        symbol: asset.symbol, name: asset.name, group: asset.group,
        exchange: asset.exchange || raw.exchange || null,
        currency: raw.currency || asset.currency || null,
        price, open: toNumber(raw.open), change: toNumber(raw.change),
        changePercent: toNumber(raw.percent_change), datetime: raw.datetime || null,
        isMarketOpen: typeof raw.is_market_open === 'boolean' ? raw.is_market_open : null,
        fetchedAt: new Date().toISOString(),
      },
    };
  } catch {
    return { error: 'Twelve Data could not be reached' };
  }
}

export default async function(req) {
  try {
    const client = createClientFromRequest(req);
    const store = client.asServiceRole.entities.MarketDataCache;
    const [state] = await store.filter({ key: 'twelve-data-v2' }, 'created_date', 1);
    if (!state) return Response.json({ error: 'Market cache is not initialized' }, { status: 500 });
    const apiKey = secrets.get('TWELVE_DATA_API_KEY');
    if (!apiKey) return Response.json({ error: 'TWELVE_DATA_API_KEY is not configured' }, { status: 500 });

    const now = Date.now();
    if ((state.lease_until || 0) > now) return Response.json({ updated: 0, message: 'Refresh already completed for this interval' });
    const attempts = { ...state.attempts };
    const due = assets.sort((a, b) => (attempts[a.symbol] || 0) - (attempts[b.symbol] || 0)).slice(0, batchSize);
    await store.update(state.id, { lease_until: now + refreshIntervalMs });

    const responses = await Promise.all(due.map(asset => fetchQuote(asset, apiKey)));
    const quotes = { ...state.quotes };
    const issues = { ...state.issues };
    responses.forEach((response, index) => {
      const symbol = due[index].symbol;
      attempts[symbol] = now;
      if (response.quote) {
        quotes[symbol] = response.quote;
        delete issues[symbol];
      } else {
        issues[symbol] = response.error;
      }
    });
    const successful = responses.filter(response => response.quote).length;
    await store.update(state.id, {
      quotes, attempts, issues,
      message: successful ? '' : 'The latest scheduled refresh failed; previous real prices remain available.',
    });
    return Response.json({ updated: successful, attempted: due.map(asset => asset.symbol) });
  } catch (error) {
    return Response.json({ error: error.message || 'Scheduled market refresh failed' }, { status: 500 });
  }
}