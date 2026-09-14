import { useMemo, useState } from 'react';
import TradingViewMiniChart from '@/components/market/TradingViewMiniChart';
import TradingViewDFMChart from '@/components/market/TradingViewDFMChart';

const stocks = [
  { symbol: 'DFM:EMAAR', name: 'Emaar Properties', exchange: 'DFM', sector: 'Real Estate' },
  { symbol: 'ADX:ADCB', name: 'Abu Dhabi Commercial Bank', exchange: 'ADX', sector: 'Banking' },
  { symbol: 'ADX:ADIB', name: 'Abu Dhabi Islamic Bank', exchange: 'ADX', sector: 'Banking' },
  { symbol: 'ADX:ADNOCDIST', name: 'ADNOC Distribution', exchange: 'ADX', sector: 'Energy' },
  { symbol: 'DFM:ALDAR', name: 'Aldar Properties', exchange: 'DFM', sector: 'Real Estate' },
  { symbol: 'DFM:EMIRATESNBD', name: 'Emirates NBD', exchange: 'DFM', sector: 'Banking' },
];

export default function UAEStocksPanel() {
  const [filter, setFilter] = useState('All');
  const sectors = useMemo(() => ['All', ...new Set(stocks.map(stock => stock.sector))], []);
  const filtered = filter === 'All' ? stocks : stocks.filter(stock => stock.sector === filter);

  return <div className="space-y-4">
    <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4">
      <p className="text-sm font-semibold text-blue-300">Live ADX & DFM market charts</p>
      <p className="text-xs text-muted-foreground mt-1">Official TradingView widgets show the latest available market data with no simulated prices.</p>
    </div>
    <div className="flex gap-1.5 flex-wrap">{sectors.map(sector => <button key={sector} onClick={() => setFilter(sector)} className={`text-xs px-3 py-1.5 rounded-full border ${filter === sector ? 'bg-primary/10 border-primary/30 text-primary font-semibold' : 'border-border text-muted-foreground'}`}>{sector}</button>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{filtered.map(stock => <article key={stock.symbol} className="glass-card rounded-2xl border border-border p-4"><div className="mb-3"><p className="text-sm font-bold">{stock.name}</p><p className="text-xs text-muted-foreground">{stock.exchange} · {stock.sector}</p></div>{stock.exchange === 'DFM' ? <TradingViewDFMChart key={stock.symbol} symbol={stock.symbol} /> : <TradingViewMiniChart symbol={stock.symbol} />}</article>)}</div>
  </div>;
}