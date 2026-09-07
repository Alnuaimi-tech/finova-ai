import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GROUPS = [
  { title: 'Global Indices', subtitle: 'Via ETF proxies', symbols: ['SPY', 'QQQ'] },
  { title: 'Major Stocks', subtitle: 'US large-cap', symbols: ['AAPL', 'NVDA'] },
  { title: 'Cryptocurrency', subtitle: 'Live', symbols: ['BTC/USD', 'ETH/USD'] },
  { title: 'Forex', subtitle: 'Currency pairs', symbols: ['USD/AED', 'EUR/USD'] },
];

const isForex = (s) => /^[A-Z]{3}\/[A-Z]{3}$/.test(s);
const isCrypto = (s) => /\/USD$/.test(s) && !isForex(s);

function formatPrice(symbol, price) {
  if (price == null) return '—';
  if (isForex(symbol)) return price.toFixed(4);
  if (isCrypto(symbol)) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function QuoteCard({ quote, index }) {
  if (!quote) return null;
  const up = quote.change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="glass-card rounded-2xl border border-border p-4 hover:border-white/10 transition-all"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <p className="text-sm font-space font-bold text-foreground">{quote.symbol}</p>
          <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1">{quote.name}</p>
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
          {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {up ? '+' : ''}{quote.changePercent.toFixed(2)}%
        </div>
      </div>
      <p className="text-lg font-space font-bold text-foreground tabular-nums">{formatPrice(quote.symbol, quote.price)}</p>
      <div className="flex items-center justify-between mt-1.5">
        <span className={`text-xs font-medium ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
          {up ? '+' : ''}{quote.change.toFixed(2)}
        </span>
        {quote.isMarketOpen != null && (
          <span className={`flex items-center gap-1 text-[10px] font-medium ${quote.isMarketOpen ? 'text-emerald-400' : 'text-muted-foreground'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${quote.isMarketOpen ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground'}`} />
            {quote.isMarketOpen ? 'Open' : 'Closed'}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function LiveMarketOverview() {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await base44.functions.invoke('getMarketData', {});
      setQuotes(res.data.quotes || {});
      setFetchedAt(res.data.fetchedAt || new Date().toISOString());
    } catch (e) {
      setError(e.message || 'Failed to load market data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMarketData(); }, [fetchMarketData]);

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(fetchMarketData, 180000);
    return () => clearInterval(id);
  }, [fetchMarketData]);

  if (loading && !Object.keys(quotes).length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-9 h-9 border-2 border-border border-t-primary rounded-full animate-spin mb-3" />
        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Loading live market data…</p>
      </div>
    );
  }

  if (error && !Object.keys(quotes).length) {
    return (
      <div className="glass-card rounded-2xl border border-rose-500/20 p-8 text-center">
        <p className="text-sm text-rose-400 mb-2">Couldn't load market data</p>
        <p className="text-xs text-muted-foreground mb-4">{error}</p>
        <button onClick={fetchMarketData} className="gold-gradient text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between glass-card rounded-2xl border border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm font-space font-semibold text-foreground">Live Global Markets</span>
          <span className="hidden sm:inline text-[11px] text-muted-foreground ml-1">
            {fetchedAt ? `· Updated ${new Date(fetchedAt).toLocaleTimeString()}` : ''}
          </span>
        </div>
        <button onClick={fetchMarketData} disabled={refreshing}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:border-white/10 rounded-lg px-2.5 py-1.5 transition-all disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {GROUPS.map((group) => {
        const groupQuotes = group.symbols.map((s) => quotes[s]).filter(Boolean);
        if (!groupQuotes.length) return null;
        return (
          <div key={group.title}>
            <div className="flex items-baseline gap-2 mb-3">
              <h3 className="text-sm font-space font-bold text-foreground">{group.title}</h3>
              <span className="text-[11px] text-muted-foreground">{group.subtitle}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.symbols.map((sym, i) => (
                <QuoteCard key={sym} quote={quotes[sym]} index={i} />
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-center text-xs text-muted-foreground pb-1">
        ✅ Live data via Twelve Data · auto-refreshes every 3 min · prices in USD (forex as rate)
      </p>
    </div>
  );
}