export default function MarketQuoteCard({ asset, quote, issue }) {
  const hasChange = Number.isFinite(quote?.changePercent);
  const color = !hasChange ? 'text-muted-foreground' : quote.changePercent >= 0 ? 'text-market-up' : 'text-market-down';
  return (
    <div className="glass-card rounded-2xl border border-border p-4">
      <p className="text-sm font-space font-bold text-foreground">{asset.name}</p>
      <p className="text-xs text-muted-foreground mt-1">{asset.symbol}{asset.exchange ? ` · ${asset.exchange}` : ''}</p>
      <p className="text-lg font-space font-bold mt-3">{quote ? `${quote.price.toLocaleString('en-US', { maximumFractionDigits: asset.group === 'forex' ? 4 : 2 })} ${asset.group === 'indices' ? 'pts' : quote.currency || asset.currency || ''}` : '—'}</p>
      <p className={`text-xs font-semibold mt-1 ${color}`}>{hasChange ? `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%` : 'Daily change unavailable'}</p>
      {quote && <p className="text-[10px] text-muted-foreground mt-2">{quote.stale ? 'Last known · ' : 'Retrieved · '}{new Date(quote.fetchedAt).toLocaleString()}{quote.datetime ? ` · Market time: ${quote.datetime}` : ''}</p>}
      {issue && <p className="text-xs text-muted-foreground mt-2">{issue}</p>}
    </div>
  );
}