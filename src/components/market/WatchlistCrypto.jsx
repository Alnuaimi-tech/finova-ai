import { useState, useEffect } from 'react';
import { Star, Bitcoin, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const CRYPTO = [
  { symbol: 'BTC', name: 'Bitcoin', emoji: '₿', price: 67420, change: +1.22, vol: 0.015, mktCap: '1.33T' },
  { symbol: 'ETH', name: 'Ethereum', emoji: '🔷', price: 3512, change: -0.88, vol: 0.013, mktCap: '421B' },
  { symbol: 'SOL', name: 'Solana', emoji: '☀️', price: 172.4, change: +2.41, vol: 0.02, mktCap: '79B' },
  { symbol: 'BNB', name: 'BNB', emoji: '🟡', price: 589.2, change: +0.34, vol: 0.01, mktCap: '86B' },
];

const FOREX = [
  { symbol: 'EUR/USD', flag: '🇪🇺', price: 1.0842, change: +0.02, vol: 0.003 },
  { symbol: 'GBP/USD', flag: '🇬🇧', price: 1.2714, change: -0.05, vol: 0.004 },
  { symbol: 'USD/AED', flag: '🇦🇪', price: 3.6725, change: 0.0, vol: 0.001 },
  { symbol: 'USD/JPY', flag: '🇯🇵', price: 154.32, change: +0.18, vol: 0.005 },
];

function TickerRow({ item, isCrypto }) {
  const [data, setData] = useState(item);
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => ({
        ...prev,
        price: parseFloat((prev.price * (1 + (Math.random() - 0.499) * prev.vol * 0.4)).toFixed(prev.price > 100 ? 2 : 4)),
        change: parseFloat((prev.change + (Math.random() - 0.5) * 0.04).toFixed(2)),
      }));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const up = data.change >= 0;
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary/30 transition-all cursor-pointer">
      <span className="text-lg">{isCrypto ? data.emoji : data.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground">{data.symbol}</p>
        <p className="text-xs text-muted-foreground">{isCrypto ? data.name : ''}{isCrypto && data.mktCap ? ` · ${data.mktCap}` : ''}</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold font-space text-foreground">
          {data.price > 1000 ? data.price.toLocaleString() : data.price}
        </p>
        <p className={`text-xs font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
          {up ? '+' : ''}{data.change}%
        </p>
      </div>
    </div>
  );
}

export default function WatchlistCrypto() {
  const [tab, setTab] = useState('crypto');

  return (
    <div className="glass-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-primary" />
        <p className="text-sm font-bold text-foreground">Watchlist</p>
      </div>

      <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl mb-4">
        {['crypto', 'forex'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-card text-foreground border border-border shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'crypto' ? '₿ Crypto' : '💱 Forex'}
          </button>
        ))}
      </div>

      <div className="space-y-0.5">
        {tab === 'crypto'
          ? CRYPTO.map((c, i) => <TickerRow key={i} item={c} isCrypto={true} />)
          : FOREX.map((f, i) => <TickerRow key={i} item={f} isCrypto={false} />)
        }
      </div>
    </div>
  );
}