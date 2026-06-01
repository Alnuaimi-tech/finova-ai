import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, TrendingUp, Bell, Search, ChevronUp, ChevronDown } from 'lucide-react';

const TICKERS = [
  { symbol: 'ADNOC', price: 3.82, change: +0.04 },
  { symbol: 'EMAAR', price: 7.85, change: -0.12 },
  { symbol: 'FAB', price: 13.50, change: +0.08 },
  { symbol: 'BTC/USD', price: 67420, change: +1.2 },
  { symbol: 'GOLD', price: 2341, change: -0.3 },
  { symbol: 'EUR/USD', price: 1.0842, change: +0.02 },
  { symbol: 'S&P 500', price: 5287, change: +0.6 },
  { symbol: 'DXB INDEX', price: 4312, change: +0.9 },
];

export default function MarketHeader() {
  const navigate = useNavigate();
  const [tickerData, setTickerData] = useState(TICKERS);

  useEffect(() => {
    const id = setInterval(() => {
      setTickerData(prev => prev.map(t => ({
        ...t,
        price: parseFloat((t.price * (1 + (Math.random() - 0.499) * 0.002)).toFixed(t.price > 100 ? 0 : 3)),
        change: parseFloat((t.change + (Math.random() - 0.5) * 0.05).toFixed(2)),
      })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/90 backdrop-blur-xl">
      {/* Ticker tape */}
      <div className="bg-secondary/40 border-b border-border/30 overflow-hidden py-1.5">
        <div className="flex gap-8 animate-[marquee_30s_linear_infinite] w-max px-4">
          {[...tickerData, ...tickerData].map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-xs whitespace-nowrap">
              <span className="font-bold text-foreground">{t.symbol}</span>
              <span className="text-muted-foreground">{typeof t.price === 'number' && t.price > 100 ? t.price.toLocaleString() : t.price}</span>
              <span className={`flex items-center gap-0.5 font-semibold ${t.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.change >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {t.change >= 0 ? '+' : ''}{t.change}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
            <Cpu className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-space font-bold text-base md:text-lg tracking-tight">FINOVA <span className="text-primary">AI</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
          {[
            { label: 'Market', to: '/market' },
            { label: 'Stocks', to: '/stocks' },
            { label: 'Education', to: '/education' },
            { label: 'Dashboard', to: '/dashboard' },
          ].map(n => (
            <Link key={n.to} to={n.to} className="px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-secondary/50 transition-all">{n.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="Search stocks…" className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none w-24 md:w-32" />
          </div>
          <button className="relative p-1.5 md:p-2 rounded-xl border border-border hover:bg-secondary/50 transition-all">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
          <button onClick={() => navigate('/analyze')} className="gold-gradient text-primary-foreground text-xs font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-xl">
            My Score
          </button>
        </div>
      </div>
    </header>
  );
}