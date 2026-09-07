import { secrets } from "base44:runtime";

const TWELVEDATA_BASE = "https://api.twelvedata.com";

// Default symbols to fetch when no specific list is provided.
// Indices via ETF proxies, major stocks, crypto, forex.
const DEFAULT_SYMBOLS = [
  "SPY", "QQQ", "IWM", "VTI",        // index proxies
  "AAPL", "MSFT", "NVDA", "TSLA",    // major stocks
  "BTC/USD", "ETH/USD",              // crypto
  "USD/AED", "EUR/USD", "GBP/USD",  // forex
  "GLD", "USO",                       // commodities proxies
];

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const symbols = (body.symbols && body.symbols.length)
      ? body.symbols
      : DEFAULT_SYMBOLS;

    const apiKey = secrets.get("TWELVEDATA_API_KEY");
    if (!apiKey) {
      return Response.json(
        { error: "TWELVEDATA_API_KEY secret is not set." },
        { status: 500 }
      );
    }

    // Twelve Data supports comma-separated symbols in a single quote call.
    const symbolList = symbols.join(",");
    const url = `${TWELVEDATA_BASE}/quote?symbol=${encodeURIComponent(symbolList)}&apikey=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
      return Response.json(
        { error: `Twelve Data request failed (${res.status})` },
        { status: 502 }
      );
    }
    const raw = await res.json();

    // Normalize: batch returns { "SPY": {...} }, single returns {...}
    const entries = Array.isArray(raw) || !symbols || symbols.length > 1
      ? Object.entries(raw)
      : [["0", raw]];

    const quotes = {};
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

    return Response.json({ quotes, fetchedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}