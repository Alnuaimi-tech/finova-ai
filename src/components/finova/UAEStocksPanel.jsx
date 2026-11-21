import { useMemo, useState } from 'react';
import DemoDFMCard from '@/components/market/DemoDFMCard';
import { useLanguage } from '@/lib/LanguageContext';

// TradingView's free embed no longer renders ADX symbols ("This symbol is only available on TradingView"),
// so ADX cards link to the live TradingView page instead of showing a broken chart or a made-up price.
function LiveLinkCard({ symbol, mk }) {
  const url = `https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/`;
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
      <p className="text-sm text-muted-foreground">{mk.adxNoLive}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        {mk.viewOnTradingView} ↗
      </a>
    </div>
  );
}

const stocks = [
  { symbol: 'ADX:ADCB', name: 'Abu Dhabi Commercial Bank', exchange: 'ADX', sector: 'Banking' },
  { symbol: 'ADX:ADIB', name: 'Abu Dhabi Islamic Bank', exchange: 'ADX', sector: 'Banking' },
  { symbol: 'ADX:ADNOCDIST', name: 'ADNOC Distribution', exchange: 'ADX', sector: 'Energy' },
  { symbol: 'DFM:EMAAR', name: 'Emaar Properties', exchange: 'DFM', sector: 'Real Estate' },
  { symbol: 'DFM:ALDAR', name: 'Aldar Properties', exchange: 'DFM', sector: 'Real Estate' },
  { symbol: 'DFM:EMIRATESNBD', name: 'Emirates NBD', exchange: 'DFM', sector: 'Banking' },
  { symbol: 'DFM:DFMGI', name: 'DFM General Index', exchange: 'DFM', sector: 'Index' },
];

export default function UAEStocksPanel() {
  const { t } = useLanguage();
  const mk = t.mk;
  const [filter, setFilter] = useState('All');
  const sectors = useMemo(() => ['All', ...new Set(stocks.map(stock => stock.sector))], []);
  const filtered = filter === 'All' ? stocks : stocks.filter(stock => stock.sector === filter);
  const sectorLabel = (sector) => mk.sectors[sector] || sector;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4">
        <p className="text-sm font-semibold text-blue-300">{mk.uaeTitle}</p>
        <p className="text-xs text-muted-foreground mt-1">{mk.uaeDesc}</p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {sectors.map(sector => (
          <button key={sector} onClick={() => setFilter(sector)}
            className={`text-xs px-3 py-1.5 rounded-full border ${filter === sector ? 'bg-primary/10 border-primary/30 text-primary font-semibold' : 'border-border text-muted-foreground'}`}>
            {sectorLabel(sector)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(stock => (
          <article key={stock.symbol} className="glass-card rounded-2xl border border-border p-4">
            <div className="mb-3">
              <p className="text-sm font-bold">{stock.name}</p>
              <p className="text-xs text-muted-foreground">{stock.exchange} · {sectorLabel(stock.sector)}</p>
            </div>
            {stock.exchange === 'DFM'
              ? <DemoDFMCard symbol={stock.symbol} />
              : <LiveLinkCard symbol={stock.symbol} mk={mk} />}
          </article>
        ))}
      </div>
    </div>
  );
}