import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, HelpCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// ─── UAE Companies Data ───────────────────────────────────────────────────────
const UAE_STOCKS = [
  {
    ticker: 'ADNOCDIST', name: 'ADNOC Distribution', exchange: 'ADX',
    emoji: '⛽', sector: 'Energy',
    simpleDesc: 'Runs petrol stations all over the UAE. You\'ve probably stopped at one!',
    whyKnow: 'Very stable — people always need fuel. Good for beginners to study.',
    riskLevel: 'Low', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10',
    basePrice: 3.82, volatility: 0.006,
  },
  {
    ticker: 'ADNOCGAS', name: 'ADNOC Gas', exchange: 'ADX',
    emoji: '🔵', sector: 'Energy',
    simpleDesc: 'Part of ADNOC — processes gas used in homes and factories across the UAE.',
    whyKnow: 'Backed by the UAE government. Strong and reliable.',
    riskLevel: 'Low', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10',
    basePrice: 3.21, volatility: 0.007,
  },
  {
    ticker: 'EMIRATESNBD', name: 'Emirates NBD', exchange: 'DFM',
    emoji: '🏦', sector: 'Banking',
    simpleDesc: 'Dubai\'s biggest bank. Many students have their salary account here.',
    whyKnow: 'Banks make money when people borrow. A classic long-term stock.',
    riskLevel: 'Low–Med', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10',
    basePrice: 17.20, volatility: 0.007,
  },
  {
    ticker: 'FAB', name: 'First Abu Dhabi Bank', exchange: 'ADX',
    emoji: '🏦', sector: 'Banking',
    simpleDesc: 'The UAE\'s largest bank by size. Huge in Abu Dhabi and across the region.',
    whyKnow: 'Very large, very stable. Considered a "blue chip" stock.',
    riskLevel: 'Low', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10',
    basePrice: 13.50, volatility: 0.005,
  },
  {
    ticker: 'EMAAR', name: 'Emaar Properties', exchange: 'DFM',
    emoji: '🏙️', sector: 'Real Estate',
    simpleDesc: 'Built the Burj Khalifa and Dubai Mall. One of the most famous UAE companies.',
    whyKnow: 'Real estate can be more volatile but Emaar is well-known globally.',
    riskLevel: 'Medium', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10',
    basePrice: 7.85, volatility: 0.012,
  },
  {
    ticker: 'ETISALAT', name: 'e& (Etisalat)', exchange: 'ADX',
    emoji: '📱', sector: 'Telecom',
    simpleDesc: 'Your phone plan is probably with them. UAE\'s biggest telecom company.',
    whyKnow: 'Pays regular dividends (like a bonus payment to investors). Steady stock.',
    riskLevel: 'Low', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10',
    basePrice: 22.40, volatility: 0.005,
  },
  {
    ticker: 'DPWORLD', name: 'DP World', exchange: 'DFM',
    emoji: '🚢', sector: 'Logistics',
    simpleDesc: 'Runs ports worldwide — including Jebel Ali, one of the world\'s biggest ports.',
    whyKnow: 'Global shipping affects its price. Less affected by local news.',
    riskLevel: 'Medium', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10',
    basePrice: 18.60, volatility: 0.008,
  },
  {
    ticker: 'ALDAR', name: 'Aldar Properties', exchange: 'ADX',
    emoji: '🏗️', sector: 'Real Estate',
    simpleDesc: 'Abu Dhabi\'s top property developer. Builds homes, malls, and schools.',
    whyKnow: 'Tied to Abu Dhabi\'s growth. Can be good long-term.',
    riskLevel: 'Medium', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10',
    basePrice: 5.34, volatility: 0.01,
  },
  {
    ticker: 'DIB', name: 'Dubai Islamic Bank', exchange: 'DFM',
    emoji: '🕌', sector: 'Banking',
    simpleDesc: 'An Islamic bank — no interest, follows Sharia law. Popular in the UAE.',
    whyKnow: 'Great example of Sharia-compliant investing. Growing fast.',
    riskLevel: 'Low–Med', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10',
    basePrice: 6.10, volatility: 0.007,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateHistory(basePrice, volatility, seed) {
  const rand = seededRandom(seed);
  let price = basePrice * 0.94;
  return Array.from({ length: 30 }, () => {
    price = Math.max(price * 0.5, price + (rand() - 0.48) * volatility * price);
    return { price: parseFloat(price.toFixed(3)) };
  });
}

function buildStock(s, idx) {
  const history = generateHistory(s.basePrice, s.volatility, idx * 137 + 7);
  const open = history[0].price;
  const current = history[history.length - 1].price;
  return { ...s, history, open, current, change: current - open, changePct: (((current - open) / open) * 100).toFixed(2) };
}

function tick(price, volatility) {
  return parseFloat((price + (Math.random() - 0.495) * volatility * price).toFixed(3));
}

const MiniChart = ({ data, up }) => (
  <ResponsiveContainer width={72} height={32}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="price" stroke={up ? '#10b981' : '#f43f5e'} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UAEStocksPanel() {
  const [stocks, setStocks] = useState(() => UAE_STOCKS.map(buildStock));
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [tick2, setTick2] = useState(0);

  const sectors = useMemo(() => ['All', 'Energy', 'Banking', 'Real Estate', 'Telecom', 'Logistics'], []);

  // Live price simulation every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const newPrice = tick(s.current, s.volatility);
        const newHistory = [...s.history.slice(1), { price: newPrice }];
        return { ...s, current: newPrice, history: newHistory, change: newPrice - s.open, changePct: (((newPrice - s.open) / s.open) * 100).toFixed(2) };
      }));
      setTick2(t => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const filtered = filter === 'All' ? stocks : stocks.filter(s => s.sector === filter);

  return (
    <div className="space-y-4">

      {/* Simple explainer */}
      <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4 space-y-1">
        <p className="text-sm font-semibold text-blue-300">📖 What am I looking at?</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          These are real UAE companies whose shares (stocks) are bought and sold every day on the <strong className="text-foreground">ADX</strong> (Abu Dhabi) and <strong className="text-foreground">DFM</strong> (Dubai) stock markets.
          The prices below are <strong className="text-foreground">simulated for practice</strong> — they move like real prices so you can learn how stocks behave. Tap any company to learn more.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {sectors.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === s ? 'bg-primary/10 border-primary/30 text-primary font-semibold' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Updates every 3s
        </div>
      </div>

      {/* Stock cards */}
      <div className="space-y-2">
        {filtered.map((s, i) => {
          const up = s.change >= 0;
          const isOpen = selected === s.ticker;
          return (
            <motion.div key={s.ticker} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className={`glass-card rounded-2xl border transition-all cursor-pointer ${isOpen ? 'border-primary/30' : 'border-border hover:border-white/10'}`}
                onClick={() => setSelected(isOpen ? null : s.ticker)}>

                {/* Row */}
                <div className="flex items-center gap-3 p-4">
                  <span className="text-2xl flex-shrink-0">{s.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-foreground">{s.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${s.exchange === 'ADX' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                        {s.exchange}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.riskBg} ${s.riskColor}`}>
                        {s.riskLevel} Risk
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:block">{s.sector}</span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <MiniChart data={s.history} up={up} />
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold font-space text-foreground">AED {s.current.toFixed(2)}</p>
                    <div className={`flex items-center justify-end gap-1 text-xs font-bold mt-0.5 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {up ? '▲' : '▼'} {up ? '+' : ''}{s.changePct}%
                    </div>
                  </div>
                </div>

                {/* Expanded plain-English detail */}
                {isOpen && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <div className="rounded-xl bg-secondary/30 border border-border p-3">
                      <p className="text-xs font-semibold text-foreground mb-1">🏢 What does this company do?</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.simpleDesc}</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
                      <p className="text-xs font-semibold text-foreground mb-1">🎓 Why should a student know this?</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.whyKnow}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-secondary/30 border border-border p-3">
                        <p className="text-xs text-muted-foreground mb-1">Started today at</p>
                        <p className="text-sm font-bold text-foreground font-space">AED {s.open.toFixed(2)}</p>
                      </div>
                      <div className="rounded-xl bg-secondary/30 border border-border p-3">
                        <p className="text-xs text-muted-foreground mb-1">Now</p>
                        <p className={`text-sm font-bold font-space ${up ? 'text-emerald-400' : 'text-rose-400'}`}>AED {s.current.toFixed(2)}</p>
                      </div>
                      <div className={`rounded-xl border p-3 ${up ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                        <p className="text-xs text-muted-foreground mb-1">{up ? 'Gone up' : 'Gone down'}</p>
                        <p className={`text-sm font-bold font-space ${up ? 'text-emerald-400' : 'text-rose-400'}`}>{up ? '+' : ''}{s.changePct}%</p>
                      </div>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      ⚠️ These are practice prices only — <a href={s.exchange === 'ADX' ? 'https://www.adx.ae' : 'https://www.dfm.ae'} target="_blank" rel="noopener noreferrer" className="underline text-primary">see real prices on {s.exchange}</a>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}