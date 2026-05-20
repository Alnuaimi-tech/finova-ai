import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const INDICES = [
  { name: 'ADX General', region: '🇦🇪 Abu Dhabi', value: 9412.3, change: +0.84, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'DFM Index', region: '🇦🇪 Dubai', value: 4311.7, change: +0.56, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'S&P 500', region: '🇺🇸 USA', value: 5287.4, change: +0.62, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'NASDAQ', region: '🇺🇸 USA', value: 18342.1, change: -0.24, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { name: 'Gold (oz)', region: '🌍 Commodity', value: 2341.0, change: -0.31, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { name: 'BTC/USD', region: '🌐 Crypto', value: 67420, change: +1.22, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export default function MarketOverview() {
  const [data, setData] = useState(INDICES);

  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => prev.map(d => ({
        ...d,
        value: parseFloat((d.value * (1 + (Math.random() - 0.499) * 0.001)).toFixed(d.value > 1000 ? 1 : 3)),
        change: parseFloat((d.change + (Math.random() - 0.5) * 0.04).toFixed(2)),
      })));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Global Markets</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {data.map((d, i) => (
          <motion.div key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`glass-card rounded-2xl border ${d.border} ${d.bg} p-3`}>
            <p className="text-xs text-muted-foreground mb-0.5">{d.region}</p>
            <p className="text-xs font-bold text-foreground truncate">{d.name}</p>
            <p className="text-base font-bold font-space text-foreground mt-1">
              {d.value > 1000 ? d.value.toLocaleString() : d.value}
            </p>
            <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${d.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {d.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {d.change >= 0 ? '+' : ''}{d.change}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}