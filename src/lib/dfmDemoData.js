// Illustrative reference prices for DFM-listed instruments.
// These are NOT live market data — TradingView widgets do not support DFM
// symbols and DFM offers no free public data feed. Prices vary lightly by day
// so the UI does not look frozen, but must never be presented as real quotes.

const BASE_PRICES = {
  'DFM:EMAAR': 7.45,
  'DFM:ALDAR': 3.95,
  'DFM:EMIRATESNBD': 6.18,
  'DFM:DFMGI': 4200,
};

export const DFM_SYMBOLS = Object.keys(BASE_PRICES);

export function isDfmSymbol(symbol) {
  return Object.prototype.hasOwnProperty.call(BASE_PRICES, symbol);
}

export function dfmUnit(symbol) {
  return symbol === 'DFM:DFMGI' ? 'pts' : 'AED';
}

export function dfmDemoPrice(symbol) {
  const base = BASE_PRICES[symbol] ?? 5.0;
  const daySeed = new Date().getDate();
  // ±~1.2% deterministic daily drift — stable within a day, varies across days.
  return base * (1 + Math.sin(daySeed * 1.7) * 0.012);
}

export function dfmDemoSeries(symbol, points = 30) {
  const base = BASE_PRICES[symbol] ?? 5.0;
  const daySeed = new Date().getDate();
  return Array.from({ length: points }, (_, i) => ({
    i,
    v: base * (1 + Math.sin(i * 0.35 + daySeed * 0.7) * 0.018 + Math.cos(i * 0.12) * 0.006),
  }));
}