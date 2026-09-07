import { secrets } from "base44:runtime";

const TWELVEDATA_BASE = "https://api.twelvedata.com";
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 min — Twelve Data free tier is 8 credits/min, 800/day

// Module-level cache + in-flight dedup — persists across invocations on the isolate.
let cache = { data: null, at: 0 };
let inflight = null;

// Curated 8 symbols (each = 1 credit): 2 indices, 2 stocks, 2 crypto, 2 forex.
const DEFAULT_SYMBOLS = [
  "SPY", "QQQ",
  "AAPL", "NVDA",
  "BTC/USD", "ETH/USD",
  "USD/AED", "EUR/USD",
];

function normalize(raw, symbols) {
  const quotes = {};
  const entries = symbols.length > 1 ? Object.entries(raw) : [["0", raw]];
  for (const [key, data] of entries) {
    if (!data || data.status === "error") continue;
    const sym = data.symbol || key;
    quotes[sym] = {
      symbol: sym,
      name: data.name || sym,
      price: parseFloat(data.close) || parseFloat(data.price) || 0,
      open: parseFloat(data.open) || 0,
      high: parseFloat(data.high) || 0,
      low: parseFloat(data.low) || 0,
      change: parseFloat(data.change) || 0,
      changePercent: parseFloat(data.percent_change) || 0,
      datetime: data.datetime || null,
      isMarketOpen: data.is_market_open === true,
    };
  }
  return quotes;
}

async function fetchFresh(symbols) {
  const apiKey = secrets.get("TWELVEDATA_API_KEY");
  if (!apiKey) throw new Error("TWELVEDATA_API_KEY secret is not set.");
  const url = `${TWELVEDATA_BASE}/quote?symbol=${encodeURIComponent(symbols.join(","))}&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429 && cache.data) return { quotes: cache.data, at: cache.at, stale: true };
    throw new Error(`Twelve Data request failed (${res.status})`);
  }
  const raw = await res.json();
  const quotes = normalize(raw, symbols);
  cache = { data: quotes, at: Date.now() };
  return { quotes, at: cache.at, stale: false };
}

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const symbols = (body.symbols && body.symbols.length) ? body.symbols : DEFAULT_SYMBOLS;

    const now = Date.now();
    if (cache.data && (now - cache.at) < CACHE_TTL_MS) {
      return Response.json({ quotes: cache.data, fetchedAt: new Date(cache.at).toISOString(), cached: true });
    }

    // Dedupe concurrent calls (e.g. StrictMode double-mount) so only one fetch runs.
    if (!inflight) inflight = fetchFresh(symbols).finally(() => { inflight = null; });
    const { quotes, at, stale } = await inflight;

    return Response.json({ quotes, fetchedAt: new Date(at).toISOString(), cached: stale === true, stale: stale === true });
  } catch (error) {
    if (cache.data) return Response.json({ quotes: cache.data, fetchedAt: new Date(cache.at).toISOString(), cached: true, stale: true });
    return Response.json({ error: error.message }, { status: 500 });
  }
}