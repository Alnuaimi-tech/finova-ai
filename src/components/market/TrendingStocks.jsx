import { useState, useEffect } from 'react';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const TRENDING = [
  { symbol: 'ADNOCDIST', name: 'ADNOC Dist.', emoji: '⛽', price: 3.82, change: +2.14, exchange: 'ADX', vol: 0.007 },
  { symbol: 'EMAAR', name: 'Emaar', emoji: '🏙️', price: 7.85, change: -1.23, exchange: 'DFM', vol: 0.012 },
  { symbol: 'AAPL', name: 'Apple', emoji: '🍎', price: 188.4, change: +0.89, exchange: 'NASDAQ', vol: 0.008 },
  { symbol: 'TSLA', name: 'Tesla', emoji: '🚗', price: 242.1, change: -2.44, exchange: 'NASDAQ', vol: 0.018 },
  { symbol: 'NVDA', name: 'NVIDIA', emoji: '🎮', price: 875.6, change: +3.12, exchange: 'NASDAQ', vol: 0.014 },
  { symbol: 'DIB', name: 'Dubai Islamic', emoji: '🕌', price: 6.10, change: +0.65, exchange: 'DFM', vol: 0.006 },
  { symbol: 'BTC', name: 'Bitcoin', emoji: '₿', price: 67420, change: +1.22, exchange: 'Crypto', vol: 0.015 },
  { symbol: 'ETH', name: 'Ethereum', emoji: '🔷', price: 3512, change: -0.88, exchange: 'Crypto', vol: 0.013 },
];

export default function TrendingStocks() {
  const [stocks, setStocks] = useState(TRENDING);

  useEffect(() => {
    const id = setInterval(() => {
      setStocks(prev => prev.map(s => ({
        ...s,
        price: parseFloat((s.price * (1 + (Math.random() - 0.499) * s.vol * 0.3)).toFixed(s.price > 100 ? 2 : 3)),
        change: parseFloat((s.change + (Math.random() - 0.5) * 0.06).toFixed(2)),
      })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-orange-400" />
        <p className="text-sm font-bold text-foreground">Trending Now</p>
        <span className="ml-auto text-xs text-muted-foreground">Live simulation</span>
      </div>
      <div className="space-y-2">
        {stocks.map((s, i) => {
          const up = s.change >= 0;
          return (
            <motion.div key={s.symbol} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 transition-all cursor-pointer">
              <span className="text-xl w-8 text-center">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{s.symbol}</p>
                <p className="text-xs text-muted-foreground">{s.name} · {s.exchange}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-space text-foreground">
                  {s.price > 1000 ? s.price.toLocaleString() : s.price}
                </p>
                <div className={`flex items-center justify-end gap-0.5 text-xs font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {up ? '+' : ''}{s.change}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}