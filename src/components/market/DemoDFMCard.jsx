import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
import { dfmDemoPrice, dfmDemoSeries, dfmUnit } from '@/lib/dfmDemoData';

const DEMO_NOTE = 'Demo data — live DFM pricing requires a licensed data feed.';

export default function DemoDFMCard({ symbol, height = 220, compact = false }) {
  const price = useMemo(() => dfmDemoPrice(symbol), [symbol]);
  const series = useMemo(() => dfmDemoSeries(symbol), [symbol]);
  const unit = dfmUnit(symbol);
  const isIndex = unit === 'pts';
  const formatted = isIndex ? price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : price.toFixed(2);
  const gradId = `dfm-grad-${symbol.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xl font-bold font-space text-foreground">
            {isIndex ? `${formatted} pts` : `AED ${formatted}`}
          </p>
          {!compact && <p className="text-[11px] text-muted-foreground">Illustrative reference price</p>}
        </div>
        <span className="inline-flex items-center text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-1 whitespace-nowrap">
          Demo data
        </span>
      </div>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(43 96% 56%)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(43 96% 56%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Area type="monotone" dataKey="v" stroke="hsl(43 96% 56%)" strokeWidth={2} fill={`url(#${gradId})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-amber-300/80 leading-relaxed">{DEMO_NOTE}</p>
    </div>
  );
}