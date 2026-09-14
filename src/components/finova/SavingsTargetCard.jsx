import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SavingsTargetCard({ data, metrics }) {
  const { monthly_income, current_savings } = data;
  const { monthlySurplus, totalExpenses, savingsRate } = metrics;

  // Recommended targets
  const recommendedMonthlySavings = monthly_income * 0.20;
  const emergency3Month = totalExpenses * 3;
  const emergency6Month = totalExpenses * 6;

  // Progress calculations
  const monthlyProgress = recommendedMonthlySavings > 0
    ? Math.min(100, Math.round((monthlySurplus / recommendedMonthlySavings) * 100))
    : 0;
  const emergencyProgress = emergency3Month > 0
    ? Math.min(100, Math.round((current_savings / emergency6Month) * 100))
    : 0;

  // Status determination
  const monthlyStatus = monthlySurplus >= recommendedMonthlySavings
    ? { label: 'On Track', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2 }
    : monthlySurplus > 0
      ? { label: 'Behind Target', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle }
      : { label: 'Off Track', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: AlertTriangle };

  const emergencyStatus = current_savings >= emergency6Month
    ? { label: 'Fully Funded', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: ShieldCheck }
    : current_savings >= emergency3Month
      ? { label: 'Minimum Met', color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: CheckCircle2 }
      : { label: 'Underfunded', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: AlertTriangle };

  const gap = recommendedMonthlySavings - monthlySurplus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-border p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Savings vs. Targets</p>
            <p className="text-xs text-muted-foreground">How you compare to recommended benchmarks</p>
          </div>
        </div>
      </div>

      {/* Monthly Savings Comparison */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-foreground">Monthly Savings</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${monthlyStatus.bg} ${monthlyStatus.border} ${monthlyStatus.color}`}>
            {monthlyStatus.label}
          </span>
        </div>

        {/* Dual bar comparison */}
        <div className="space-y-2.5">
          <ComparisonBar
            label="Your Savings"
            value={monthlySurplus}
            max={recommendedMonthlySavings * 1.5}
            color="bg-gold"
            highlight
          />
          <ComparisonBar
            label="Recommended (20%)"
            value={recommendedMonthlySavings}
            max={recommendedMonthlySavings * 1.5}
            color="bg-muted-foreground/40"
            dashed
          />
        </div>

        {/* Gap indicator */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Target: <span className="text-foreground font-semibold">AED {recommendedMonthlySavings.toLocaleString()}</span>/mo
          </span>
          {gap > 0 ? (
            <span className="text-rose-400 font-medium">
              Gap: AED {gap.toLocaleString()}/mo
            </span>
          ) : (
            <span className="text-emerald-400 font-medium">
              Surplus: +AED {Math.abs(gap).toLocaleString()}/mo
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50 mb-6" />

      {/* Emergency Fund Comparison */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-foreground">Emergency Fund</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${emergencyStatus.bg} ${emergencyStatus.border} ${emergencyStatus.color}`}>
            {emergencyStatus.label}
          </span>
        </div>

        {/* Multi-tier progress bar */}
        <div className="relative h-4 bg-secondary rounded-full overflow-hidden mt-3">
          {/* 3-month threshold marker */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-400/60 z-10" />
          {/* Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${emergencyProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              emergencyProgress >= 100 ? 'bg-emerald-400' :
              emergencyProgress >= 50 ? 'bg-gold' : 'bg-rose-400'
            }`}
          />
        </div>

        {/* Tier labels */}
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>3 mo (AED {emergency3Month.toLocaleString()})</span>
          <span>6 mo (AED {emergency6Month.toLocaleString()})</span>
        </div>

        {/* Current value */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            You have: <span className="text-foreground font-semibold">AED {current_savings.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            {totalExpenses > 0 ? `${(current_savings / totalExpenses).toFixed(1)} months of runway` : '—'}
          </span>
        </div>
      </div>

      {/* Summary footer */}
      <div className={`mt-5 rounded-xl border p-3 flex items-start gap-2 ${monthlyStatus.bg} ${monthlyStatus.border}`}>
        {monthlySurplus >= recommendedMonthlySavings ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              You're saving <span className="font-bold text-emerald-400">{savingsRate}%</span> of your income — meeting the 20% benchmark. Keep this up to stay on track for your goals.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className={`w-4 h-4 ${monthlyStatus.color} flex-shrink-0 mt-0.5`} />
            <p className="text-xs text-foreground leading-relaxed">
              You're saving <span className="font-bold">{savingsRate}%</span> vs the 20% target. Closing the gap of <span className="font-bold text-amber-400">AED {gap.toLocaleString()}/mo</span> would put you on track.
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

function ComparisonBar({ label, value, max, color, highlight, dashed }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] ${highlight ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{label}</span>
        <span className={`text-[10px] font-semibold ${highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
          AED {Math.max(0, value).toLocaleString()}/mo
        </span>
      </div>
      <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
        {dashed ? (
          <div className="absolute inset-0 rounded-full border border-dashed border-muted-foreground/30" style={{ width: `${Math.min(100, (value / max) * 100)}%` }}>
            <div className={`h-full w-full ${color} rounded-full opacity-50`} />
          </div>
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
            className={`h-full rounded-full ${color}`}
          />
        )}
      </div>
    </div>
  );
}