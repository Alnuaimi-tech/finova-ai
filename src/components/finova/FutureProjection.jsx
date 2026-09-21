import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2, Info, PiggyBank } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { base44 } from '@/api/base44Client';

const MILESTONES = [
  { months: 12, label: '1y', title: '1 Year' },
  { months: 60, label: '5y', title: '5 Years' },
  { months: 120, label: '10y', title: '10 Years' },
];

function ProjTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, value } = payload[0].payload;
  return (
    <div className="glass-card rounded-lg border border-border px-3 py-2 text-xs">
      <p className="text-muted-foreground">{label === 'Now' ? 'Today' : label}</p>
      <p className="font-bold text-foreground font-space">AED {value.toLocaleString()}</p>
    </div>
  );
}

export default function FutureProjection({ data, metrics }) {
  const monthlySavings = Math.max(0, metrics.monthlySurplus || 0);
  const startSavings = Math.max(0, data.current_savings || 0);

  const points = useMemo(() => {
    const arr = [];
    for (let m = 0; m <= 120; m += 12) {
      arr.push({ month: m, label: m === 0 ? 'Now' : `${m / 12}y`, value: Math.round(startSavings + monthlySavings * m) });
    }
    return arr;
  }, [startSavings, monthlySavings]);

  const milestoneValues = MILESTONES.map(ms => ({
    ...ms,
    value: Math.round(startSavings + monthlySavings * ms.months),
  }));

  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (monthlySavings <= 0) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const prompt = `You are a friendly UAE financial coach for students and young professionals. The user currently saves AED ${monthlySavings.toLocaleString()} per month and has AED ${startSavings.toLocaleString()} saved. If they keep this habit, their total savings would reach about AED ${milestoneValues[0].value.toLocaleString()} in 1 year, AED ${milestoneValues[1].value.toLocaleString()} in 5 years, and AED ${milestoneValues[2].value.toLocaleString()} in 10 years (simple accumulation, no investment returns).

Write two short, casual, plain-text sentences (no markdown, no headers):
1. "insight": what these amounts could realistically cover in the UAE (e.g. car downpayment, home downpayment, emergency fund, wedding, masters degree) — be concrete with one or two examples.
2. "suggestion": one encouraging, specific idea for how increasing their monthly savings rate would change the projection, with a quick AED example.

Return JSON only.`;
        const res = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: { insight: { type: 'string' }, suggestion: { type: 'string' } },
            required: ['insight', 'suggestion'],
          },
        });
        if (!cancelled) { setInsight(res); setLoading(false); }
      } catch {
        if (!cancelled) { setError('Could not generate the AI insight right now.'); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [monthlySavings, startSavings, milestoneValues]);

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl border border-border p-4 flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Future Savings Projection</p>
          <p className="text-xs text-muted-foreground">
            Where your current savings habit could take you — 1, 5, and 10 years from now.
          </p>
        </div>
      </div>

      {/* Projection chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Projected Total Savings</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-gold inline-block" />
              Saving AED {monthlySavings.toLocaleString()}/mo
            </span>
          </div>
        </div>

        {monthlySavings <= 0 ? (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-6 text-center">
            <PiggyBank className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground mb-1">You're not saving monthly yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your monthly surplus is AED 0 or less, so savings won't grow from here. Increasing your monthly savings is the first step — even AED 500/month adds up to AED 60,000 over 10 years.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={points} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(43 96% 56%)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(43 96% 56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(222 30% 16%)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'hsl(215 20% 50%)', fontSize: 11 }} axisLine={{ stroke: 'hsl(222 30% 16%)' }} tickLine={false} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fill: 'hsl(215 20% 50%)', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<ProjTooltip />} />
              <Area type="monotone" dataKey="value" stroke="hsl(43 96% 56%)" strokeWidth={2.5} fill="url(#projGrad)" dot={false} />
              {milestoneValues.map(ms => (
                <ReferenceDot key={ms.months} x={ms.label} y={ms.value} r={5} fill="hsl(43 96% 56%)" stroke="hsl(222 47% 6%)" strokeWidth={2} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Milestone cards */}
        {monthlySavings > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-5">
            {milestoneValues.map((ms, i) => (
              <motion.div key={ms.months} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-xl bg-secondary/30 border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{ms.title}</p>
                <p className="text-sm md:text-base font-bold font-space text-gold truncate">AED {ms.value.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mt-4 flex items-start gap-1.5 leading-relaxed">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          Projection assumes your current monthly savings continue unchanged, with no investment returns or interest. This is an estimate based on today's habits, not a guarantee — your real results depend on your future choices and circumstances.
        </p>
      </motion.div>

      {/* AI insight */}
      {monthlySavings > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground font-space">What this means for you</p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating your personalized insight…
            </div>
          ) : error ? (
            <p className="text-sm text-muted-foreground">{error}</p>
          ) : insight ? (
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{insight.insight}</p>
              <div className="rounded-xl bg-secondary/30 border border-border p-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">💡 Boost your projection</p>
                <p className="text-sm text-foreground leading-relaxed">{insight.suggestion}</p>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}