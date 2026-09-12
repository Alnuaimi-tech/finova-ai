import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import QuoteTimestamp from '@/components/market/QuoteTimestamp';

const details = {
  ADNOCDIST: ['⛽', 'Energy'], ADNOCGAS: ['🔵', 'Energy'], EMIRATESNBD: ['🏦', 'Banking'],
  FAB: ['🏦', 'Banking'], EMAAR: ['🏙️', 'Real Estate'], ETISALAT: ['📱', 'Telecom'],
  ALDAR: ['🏗️', 'Real Estate'], DIB: ['🕌', 'Banking'], DEWA: ['💡', 'Utilities'],
};

export default function UAEStocksPanel({ quotes, issues = {} }) {
  const [filter, setFilter] = useState('All');
  const stocks = useMemo(() => Object.values(quotes).filter(q => q.group === 'uae').map(q => ({
    ...q, emoji: details[q.symbol]?.[0] || '📈', sector: details[q.symbol]?.[1] || 'Other',
  })), [quotes]);
  const sectors = ['All', ...new Set(stocks.map(stock => stock.sector))];
  const filtered = filter === 'All' ? stocks : stocks.filter(stock => stock.sector === filter);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4">
        <p className="text-sm font-semibold text-blue-300">ADX & DFM companies</p>
        <p className="text-xs text-muted-foreground mt-1">Latest stored Twelve Data prices in AED. Values remain visible between scheduled refreshes.</p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {sectors.map(sector => <button key={sector} onClick={() => setFilter(sector)} className={`text-xs px-3 py-1.5 rounded-full border ${filter === sector ? 'bg-primary/10 border-primary/30 text-primary font-semibold' : 'border-border text-muted-foreground'}`}>{sector}</button>)}
      </div>
      <div className="space-y-2">
        {filtered.map((stock, index) => {
          const up = (stock.changePercent || 0) >= 0;
          return <motion.div key={stock.symbol} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="glass-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <span className="text-2xl">{stock.emoji}</span>
            <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{stock.name}</p><p className="text-xs text-muted-foreground">{stock.exchange} · {stock.sector}</p><QuoteTimestamp fetchedAt={stock.fetchedAt} /></div>
            <div className="text-right"><p className="text-sm font-bold font-space">AED {stock.price.toFixed(2)}</p><p className={`text-xs font-bold flex items-center justify-end gap-1 ${up ? 'text-market-up' : 'text-market-down'}`}>{up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{stock.changePercent == null ? 'Change unavailable' : `${up ? '+' : ''}${stock.changePercent.toFixed(2)}%`}</p></div>
          </motion.div>;
        })}
        {!filtered.length && <p className="text-sm text-muted-foreground text-center py-10">{Object.keys(details).some(symbol => issues[symbol]) ? 'The provider has not supplied UAE quotes on the connected plan. Any successfully retrieved prices will remain visible here.' : 'The first scheduled UAE market update is pending.'}</p>}
      </div>
    </div>
  );
}