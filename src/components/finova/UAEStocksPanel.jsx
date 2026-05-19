import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Building2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Simulated base prices & profile for major UAE-listed companies
const UAE_STOCKS = [
  { ticker: 'ADNOCDIST', name: 'ADNOC Distribution', exchange: 'ADX', sector: 'Energy', basePrice: 3.82, volatility: 0.008, desc: 'UAE\'s largest fuel retail network. ADX-listed. Pays consistent dividends.' },
  { ticker: 'ADNOCGAS', name: 'ADNOC Gas', exchange: 'ADX', sector: 'Energy', basePrice: 3.21, volatility: 0.009, desc: 'ADNOC Group gas processing arm. Strong government backing.' },
  { ticker: 'ADNOCLOGIST', name: 'ADNOC Logistics', exchange: 'ADX', sector: 'Logistics', basePrice: 4.15, volatility: 0.01, desc: 'ADNOC\'s marine and logistics subsidiary. Steady growth.' },
  { ticker: 'EMIRATESNBD', name: 'Emirates NBD', exchange: 'DFM', sector: 'Banking', basePrice: 17.20, volatility: 0.007, desc: 'Dubai\'s largest bank. Strong retail and corporate banking presence.' },
  { ticker: 'FAB', name: 'First Abu Dhabi Bank', exchange: 'ADX', sector: 'Banking', basePrice: 13.50, volatility: 0.006, desc: 'UAE\'s biggest bank by assets. Blue-chip ADX listing.' },
  { ticker: 'EMAAR', name: 'Emaar Properties', exchange: 'DFM', sector: 'Real Estate', basePrice: 7.85, volatility: 0.012, desc: 'Developer of Burj Khalifa & Dubai Mall. DFM flagship.' },
  { ticker: 'ETISALAT', name: 'e& (Etisalat)', exchange: 'ADX', sector: 'Telecom', basePrice: 22.40, volatility: 0.005, desc: 'UAE\'s dominant telecom provider. Reliable dividend stock.' },
  { ticker: 'DPWORLD', name: 'DP World', exchange: 'DFM', sector: 'Logistics', basePrice: 18.60, volatility: 0.008, desc: 'Global port operator headquartered in Dubai. Defensive pick.' },
  { ticker: 'ALDAR', name: 'Aldar Properties', exchange: 'ADX', sector: 'Real Estate', basePrice: 5.34, volatility: 0.01, desc: 'Abu Dhabi\'s leading real estate developer.' },
  { ticker: 'DIB', name: 'Dubai Islamic Bank', exchange: 'DFM', sector: 'Banking', basePrice: 6.10, volatility: 0.007, desc: 'World\'s largest Islamic bank. Sharia-compliant investing.' },
];

// Deterministic pseudo-random seeded walk (no external lib needed)
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generatePriceHistory(basePrice, volatility, points = 30, seed = 42) {
  const rand = seededRandom(seed);
  let price = basePrice * 0.92;
  return Array.from({ length: points }, (_, i) => {
    const change = (rand() - 0.48) * volatility * price;
    price = Math.max(price * 0.5, price + change);
    return { i, price: parseFloat(price.toFixed(3)) };
  });
}

// Re-simulate live tick (small random walk from last simulated price)
function liveTick(price, volatility) {
  const change = (Math.random() - 0.495) * volatility * price;
  return parseFloat((price + change).toFixed(3));
}

function buildStockState(stock, idx) {
  const history = generatePriceHistory(stock.basePrice, stock.volatility, 30, idx * 137 + 7);
  const current = history[history.length - 1].price;
  const open = history[0].price;
  const change = current - open;
  const changePct = ((change / open) * 100).toFixed(2);
  return { ...stock, history, current, open, change, changePct };
}

const MiniChart = ({ data, positive }) => (
  <ResponsiveContainer width={80} height={36}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="price" stroke={positive ? '#10b981' : '#f43f5e'}
        strokeWidth={1.5} dot={false} />
      <Tooltip
        content={({ active, payload }) =>
          active && payload?.length ? (
            <div className="text-xs bg-card border border-border rounded px-2 py-1 text-foreground">
              AED {payload[0].value}
            </div>
          ) : null
        }
      />
    </LineChart>
  </ResponsiveContainer>
);

export default function UAEStocksPanel() {
  const [stocks, setStocks] = useState(() => UAE_STOCKS.map(buildStockState));
  const [selected, setSelected] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filter, setFilter] = useState('All');

  const sectors = useMemo(() => ['All', ...Array.from(new Set(UAE_STOCKS.map(s => s.sector)))], []);

  // Simulate live price ticks every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const newPrice = liveTick(s.current, s.volatility);
        const newHistory = [...s.history.slice(1), { i: s.history.length, price: newPrice }];
        const change = newPrice - s.open;
        const changePct = ((change / s.open) * 100).toFixed(2);
        return { ...s, current: newPrice, history: newHistory, change, changePct };
      }));
      setLastUpdated(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'All' ? stocks : stocks.filter(s => s.sector === filter);
  const sel = selected !== null ? stocks.find(s => s.ticker === selected) : null;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {sectors.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === s
                ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Live sim · {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 px-4 py-2.5">
        <p className="text-xs text-amber-400">
          ⚠️ Prices are <strong>simulated for educational purposes only</strong> and do not reflect real ADX/DFM market data. For real prices, visit <a href="https://www.adx.ae" target="_blank" rel="noopener noreferrer" className="underline">adx.ae</a> or <a href="https://www.dfm.ae" target="_blank" rel="noopener noreferrer" className="underline">dfm.ae</a>.
        </p>
      </div>

      {/* Stock rows */}
      <div className="space-y-2">
        {filtered.map((s, i) => {
          const positive = s.change >= 0;
          const isSelected = selected === s.ticker;
          return (
            <motion.div key={s.ticker} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <button className={`w-full glass-card rounded-2xl border transition-all text-left ${isSelected ? 'border-primary/40' : 'border-border hover:border-white/10'}`}
                onClick={() => setSelected(isSelected ? null : s.ticker)}>
                <div className="flex items-center gap-3 p-4">
                  {/* Exchange badge */}
                  <div className={`flex-shrink-0 w-14 text-center rounded-lg py-1 text-xs font-bold ${s.exchange === 'ADX' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                    {s.exchange}
                  </div>

                  {/* Name & sector */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.ticker} · {s.sector}</p>
                  </div>

                  {/* Mini chart */}
                  <div className="hidden sm:block">
                    <MiniChart data={s.history} positive={positive} />
                  </div>

                  {/* Price & change */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold font-space text-foreground">AED {s.current.toFixed(3)}</p>
                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {positive ? '+' : ''}{s.changePct}%
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-secondary/30 border border-border p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Open</p>
                        <p className="text-sm font-bold text-foreground font-space">AED {s.open.toFixed(3)}</p>
                      </div>
                      <div className="rounded-xl bg-secondary/30 border border-border p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Current</p>
                        <p className={`text-sm font-bold font-space ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>AED {s.current.toFixed(3)}</p>
                      </div>
                      <div className={`rounded-xl border p-3 text-center ${positive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                        <p className="text-xs text-muted-foreground mb-1">Day Change</p>
                        <p className={`text-sm font-bold font-space ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {positive ? '+' : ''}{s.change.toFixed(3)} ({positive ? '+' : ''}{s.changePct}%)
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      🎓 Practice analyzing this stock — but never invest real money without proper research.
                    </p>
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}