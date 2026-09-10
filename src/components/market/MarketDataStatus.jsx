import { RefreshCw } from 'lucide-react';

function ageLabel(quotes) {
  const timestamps = Object.values(quotes).map(q => Date.parse(q.fetchedAt)).filter(Number.isFinite);
  if (!timestamps.length) return 'Waiting for the first scheduled update';
  const minutes = Math.max(0, Math.floor((Date.now() - Math.max(...timestamps)) / 60000));
  if (minutes < 1) return 'Last updated just now';
  return `Last updated ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
}

export default function MarketDataStatus({ market }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 mb-5 space-y-2" role="status">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{market.isPending ? 'Loading stored market data…' : ageLabel(market.quotes)}</p>
        <button onClick={() => market.refetch()} disabled={market.isFetching} className="flex items-center gap-1 text-xs text-primary disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${market.isFetching ? 'animate-spin' : ''}`} />Check latest</button>
      </div>
      <p className="text-xs text-muted-foreground">Real Twelve Data prices are refreshed automatically on a shared schedule. Opening this page never calls the market provider.</p>
      {market.data?.message && <p className="text-xs text-primary">{market.data.message}</p>}
    </div>
  );
}