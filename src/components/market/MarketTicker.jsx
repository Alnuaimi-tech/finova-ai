export default function MarketTicker({ quotes }) {
  const items = Object.values(quotes).filter(q => Number.isFinite(q.price) && q.price > 0);
  return (
    <div className="border-b border-border/40 bg-secondary/20 overflow-hidden py-2">
      {!items.length ? <p className="text-xs text-muted-foreground text-center">Waiting for available market quotes — no simulated prices.</p> : (
        <div className="flex animate-marquee gap-8 w-max">
          {[...items, ...items].map((q, i) => <div key={`${q.symbol}-${i}`} className="flex items-center gap-2 text-xs whitespace-nowrap">
            <span className="font-semibold">{q.symbol}</span><span className="text-muted-foreground">{q.price.toLocaleString(undefined, { maximumFractionDigits: 4 })} {q.currency}</span>
            <span className={q.changePercent == null ? 'text-muted-foreground' : q.changePercent >= 0 ? 'text-market-up' : 'text-market-down'}>{q.changePercent == null ? '—' : `${q.changePercent >= 0 ? '+' : ''}${q.changePercent.toFixed(2)}%`}</span>
          </div>)}
        </div>
      )}
    </div>
  );
}