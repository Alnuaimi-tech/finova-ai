import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

function ageLabel(quotes, mk) {
  const timestamps = Object.values(quotes).map(q => Date.parse(q.fetchedAt)).filter(Number.isFinite);
  if (!timestamps.length) return mk.statusWaiting;
  const minutes = Math.max(0, Math.floor((Date.now() - Math.max(...timestamps)) / 60000));
  if (minutes < 1) return mk.statusJustNow;
  return mk.statusMinutes(minutes);
}

export default function MarketDataStatus({ market }) {
  const { t } = useLanguage();
  const mk = t.mk;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 mb-5 space-y-2" role="status">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{market.isPending ? mk.statusLoading : ageLabel(market.quotes, mk)}</p>
        <button onClick={() => market.refetch()} disabled={market.isFetching} className="flex items-center gap-1 text-xs text-primary disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${market.isFetching ? 'animate-spin' : ''}`} />{mk.checkLatest}</button>
      </div>
      <p className="text-xs text-muted-foreground">{mk.statusNote}</p>
      {market.data?.message && <p className="text-xs text-primary">{market.data.message}</p>}
    </div>
  );
}