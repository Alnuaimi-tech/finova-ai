import QuoteTimestamp from '@/components/market/QuoteTimestamp';

export default function MarketQuoteCard({ asset, quote, issue }) {
  if (!quote) return null;
  const hasChange = Number.isFinite(quote.changePercent);
  const color = !hasChange ? 'text-muted-foreground' : quote.changePercent >= 0 ? 'text-market-up' : 'text-market-down';
  return (
    <div className="glass-card rounded-2xl border border-border p-4">
      <p className="text-sm font-space font-bold text-foreground">{asset.name}</p>
      <p className="text-xs text-muted-foreground mt-1">{asset.symbol}{asset.exchange ? ` · ${asset.exchange}` : ''}</p>
      <p className="text-lg font-space font-bold mt-3">{`${quote.price.toLocaleString('en-US', { maximumFractionDigits: asset.group === 'forex' ? 4 : 2 })} ${quote.currency || asset.currency || ''}`}</p>
      <p className={`text-xs font-semibold mt-1 ${color}`}>{hasChange ? `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%` : 'Daily change unavailable'}</p>
      <QuoteTimestamp fetchedAt={quote.fetchedAt} />

    </div>
  );
}