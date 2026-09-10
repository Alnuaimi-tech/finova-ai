import { RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MarketDataStatus({ market }) {
  const message = market.error ? 'Could not load market data. Please try again.' : market.data?.message;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 mb-5 space-y-2" role="status">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{market.isPending ? 'Loading market data…' : 'Latest available · Twelve Data'}</p>
        <button onClick={() => market.refetch()} disabled={market.isFetching} className="flex items-center gap-1 text-xs text-primary disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${market.isFetching ? 'animate-spin' : ''}`} />Refresh</button>
      </div>
      <p className="text-xs text-muted-foreground">Prices cached for at least 5 minutes. Requests are queued within the shared API budget; initial loading may take several minutes. Exchange coverage and delays depend on the connected plan.</p>
      {message && <p className="text-xs text-primary">{message}</p>}
      {market.data?.needsAuth && <button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="text-xs underline text-primary">Sign in to refresh</button>}
    </div>
  );
}