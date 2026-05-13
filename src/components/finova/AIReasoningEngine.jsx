import { motion } from 'framer-motion';
import { Brain, TrendingDown, TrendingUp, Minus, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Generates the reasoning trace — how each factor affected the score
 */
export function buildReasoningTrace(data, metrics) {
  const { monthly_income, rent, food, transport, shopping, other, current_savings } = data;
  const { savingsRate, expenseRatio, shoppingRatio, rentRatio, totalExpenses, monthlySurplus, monthsOfRunway } = metrics;

  const factors = [];

  // ── Savings Rate Factor (35% weight) ──────────────────────────────────────
  const savingsContrib = Math.round(metrics.savingsScore * 0.35);
  factors.push({
    name: 'Savings Rate',
    value: `${savingsRate.toFixed(1)}%`,
    weight: '35%',
    contribution: savingsContrib,
    maxContrib: 35,
    status: savingsRate >= 20 ? 'positive' : savingsRate >= 10 ? 'warning' : 'critical',
    impact: savingsRate >= 20
      ? `Strong savings rate adds ${savingsContrib} pts to your score`
      : savingsRate <= 0
      ? `Negative cashflow removes up to 35 pts — most critical issue`
      : `Low savings rate (${savingsRate.toFixed(1)}%) contributes only ${savingsContrib}/35 pts`,
    detail: `AED ${Math.max(0, monthlySurplus).toLocaleString()} saved per month`,
  });

  // ── Expense Ratio Factor (28% weight) ─────────────────────────────────────
  const expContrib = Math.round(metrics.expenseScore * 0.28);
  factors.push({
    name: 'Expense Ratio',
    value: `${expenseRatio.toFixed(1)}%`,
    weight: '28%',
    contribution: expContrib,
    maxContrib: 28,
    status: expenseRatio <= 70 ? 'positive' : expenseRatio <= 85 ? 'warning' : 'critical',
    impact: expenseRatio > 90
      ? `Critical expense ratio (${expenseRatio.toFixed(0)}%) reduces score by ~${28 - expContrib} pts`
      : expenseRatio > 75
      ? `Elevated expenses (${expenseRatio.toFixed(0)}%) limit score by ${28 - expContrib} pts`
      : `Healthy expense ratio contributes ${expContrib}/28 pts`,
    detail: `AED ${totalExpenses.toLocaleString()} / AED ${monthly_income.toLocaleString()} income`,
  });

  // ── Risky Spending Factor (27% weight) ────────────────────────────────────
  const riskContrib = Math.round(metrics.riskySpendScore * 0.27);
  factors.push({
    name: 'Discretionary Spending',
    value: `${shoppingRatio.toFixed(1)}%`,
    weight: '27%',
    contribution: riskContrib,
    maxContrib: 27,
    status: shoppingRatio <= 10 ? 'positive' : shoppingRatio <= 20 ? 'warning' : 'critical',
    impact: shoppingRatio > 20
      ? `High discretionary spend (${shoppingRatio.toFixed(0)}%) costs ~${27 - riskContrib} pts`
      : shoppingRatio > 10
      ? `Moderate shopping (${shoppingRatio.toFixed(0)}%) reduces score by ${27 - riskContrib} pts`
      : `Low discretionary spending adds ${riskContrib}/27 pts`,
    detail: `AED ${(shopping || 0).toLocaleString()} on shopping monthly`,
  });

  // ── Emergency Fund Bonus (up to +10) ──────────────────────────────────────
  factors.push({
    name: 'Emergency Fund',
    value: `${monthsOfRunway.toFixed(1)} months`,
    weight: 'Bonus',
    contribution: metrics.emergencyBonus,
    maxContrib: 10,
    status: monthsOfRunway >= 3 ? 'positive' : monthsOfRunway >= 1 ? 'warning' : 'critical',
    impact: monthsOfRunway >= 3
      ? `Solid emergency fund adds full +${metrics.emergencyBonus} bonus pts`
      : monthsOfRunway > 0
      ? `Partial emergency fund adds +${metrics.emergencyBonus} pts (target: 3 months)`
      : `No emergency fund — zero bonus pts added`,
    detail: `AED ${(current_savings || 0).toLocaleString()} saved vs AED ${totalExpenses.toLocaleString()}/mo expenses`,
  });

  // ── Rent-specific sub-note ─────────────────────────────────────────────────
  let rentNote = null;
  if (rentRatio > 30) {
    const penalty = Math.round((rentRatio - 30) / 10 * 4);
    rentNote = {
      label: 'Rent Burden',
      text: `High rent (${rentRatio.toFixed(0)}% of income) reduces your score by ~${penalty} pts`,
      severity: rentRatio > 50 ? 'critical' : 'warning',
    };
  }

  return { factors, rentNote };
}

// ─── Risk Factors & Actions ────────────────────────────────────────────────────
export function buildRiskFactorsAndActions(data, metrics) {
  const { monthly_income, shopping, rent } = data;
  const { savingsRate, expenseRatio, shoppingRatio, rentRatio, monthlySurplus, monthsOfRunway } = metrics;

  const riskFactors = [];
  const actions = [];

  // ── Risk factors (top 3) ───────────────────────────────────────────────────
  const candidates = [
    { score: expenseRatio > 90 ? 3 : expenseRatio > 75 ? 2 : 0, factor: { cause: 'Total expenses exceed income capacity', effect: 'Leaves no buffer for emergencies or savings', severity: expenseRatio > 90 ? 'critical' : 'warning' } },
    { score: savingsRate <= 0 ? 3 : savingsRate < 10 ? 2 : 0, factor: { cause: 'Insufficient monthly savings', effect: 'Builds no financial safety net over time', severity: savingsRate <= 0 ? 'critical' : 'warning' } },
    { score: shoppingRatio > 20 ? 3 : shoppingRatio > 10 ? 1 : 0, factor: { cause: 'High discretionary/shopping spend', effect: 'Diverts income from savings and essentials', severity: shoppingRatio > 20 ? 'critical' : 'warning' } },
    { score: rentRatio > 50 ? 3 : rentRatio > 35 ? 2 : 0, factor: { cause: 'Housing cost burden is excessive', effect: 'Limits flexibility and savings capacity', severity: rentRatio > 50 ? 'critical' : 'warning' } },
    { score: monthsOfRunway < 1 ? 3 : monthsOfRunway < 3 ? 1 : 0, factor: { cause: 'Emergency fund below minimum', effect: 'Any unexpected expense could cause financial crisis', severity: monthsOfRunway < 1 ? 'critical' : 'warning' } },
  ];

  candidates
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .forEach(c => riskFactors.push(c.factor));

  // ── Improvement actions (top 3) ────────────────────────────────────────────
  if (shoppingRatio > 10) {
    const saving = Math.round((shoppingRatio - 10) / 100 * monthly_income);
    actions.push({
      cause: 'High discretionary spending',
      effect: `You lose AED ${saving.toLocaleString()}/mo that could build savings`,
      action: `Reduce shopping by 15% → free up AED ${Math.round(saving * 0.15 / 0.9).toLocaleString()}/mo`,
      scoreGain: '+5–8 pts',
    });
  }

  if (savingsRate < 20) {
    const targetSurplus = Math.round(monthly_income * 0.20);
    actions.push({
      cause: 'Savings rate below 20% target',
      effect: 'Compounding growth is limited — wealth builds slowly',
      action: `Save AED ${targetSurplus.toLocaleString()}/mo (20% of income) using the 50/30/20 rule`,
      scoreGain: '+8–15 pts',
    });
  }

  if (monthsOfRunway < 3) {
    const target = Math.round(metrics.totalExpenses * 3);
    actions.push({
      cause: 'Emergency fund under 3-month threshold',
      effect: 'No cushion against job loss or unexpected costs',
      action: `Build AED ${target.toLocaleString()} emergency fund (3× monthly expenses)`,
      scoreGain: '+5–10 pts',
    });
  }

  if (rentRatio > 35) {
    actions.push({
      cause: 'Rent is above 35% of income',
      effect: 'Inflated housing costs squeeze every other category',
      action: 'Explore shared accommodation or university housing to cut rent by 15–20%',
      scoreGain: '+6–12 pts',
    });
  }

  return { riskFactors: riskFactors.slice(0, 3), actions: actions.slice(0, 3) };
}

// ─── Component ─────────────────────────────────────────────────────────────────
const statusStyles = {
  positive: { bar: 'bg-emerald-400', text: 'text-emerald-400', icon: CheckCircle2, iconColor: 'text-emerald-400' },
  warning:  { bar: 'bg-amber-400',   text: 'text-amber-400',   icon: Minus,        iconColor: 'text-amber-400'   },
  critical: { bar: 'bg-rose-400',    text: 'text-rose-400',    icon: TrendingDown, iconColor: 'text-rose-400'    },
};

export default function AIReasoningEngine({ data, metrics }) {
  const { factors, rentNote } = buildReasoningTrace(data, metrics);
  const { riskFactors, actions } = buildRiskFactorsAndActions(data, metrics);

  return (
    <div className="space-y-6">

      {/* Header card */}
      <div className="glass-card rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Brain className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">AI Reasoning Engine</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step-by-step breakdown of how each financial factor was weighted and how it affected your final score.
          </p>
        </div>
      </div>

      {/* Score formula trace */}
      <div className="glass-card rounded-2xl border border-border p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Scoring Factor Analysis</p>
        <div className="space-y-4">
          {factors.map((f, i) => {
            const s = statusStyles[f.status];
            const Icon = s.icon;
            const pct = Math.round((f.contribution / f.maxContrib) * 100);
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                    <span className="text-sm font-medium text-foreground">{f.name}</span>
                    <span className="text-xs text-muted-foreground">({f.weight} weight)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${s.text}`}>{f.value}</span>
                    <span className="text-xs text-muted-foreground">{f.contribution}/{f.maxContrib} pts</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${s.bar}`}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.07 + 0.2 }} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.impact}</p>
                <p className="text-xs text-muted-foreground/60 italic">{f.detail}</p>
              </motion.div>
            );
          })}
        </div>

        {rentNote && (
          <div className={`mt-4 flex items-start gap-2 p-3 rounded-xl ${rentNote.severity === 'critical' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
            <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${rentNote.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />
            <p className="text-xs text-muted-foreground">{rentNote.text}</p>
          </div>
        )}
      </div>

      {/* Top 3 Risk Factors */}
      <div className="glass-card rounded-2xl border border-rose-500/20 p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Top Risk Factors
        </p>
        <div className="space-y-3">
          {riskFactors.length === 0 ? (
            <p className="text-sm text-emerald-400 font-medium">✓ No major risk factors detected — your finances are stable.</p>
          ) : riskFactors.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-4 border ${r.severity === 'critical' ? 'bg-rose-500/8 border-rose-500/25' : 'bg-amber-500/8 border-amber-500/25'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {r.severity === 'critical' ? 'Critical' : 'Warning'} #{i + 1}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                <div><span className="text-muted-foreground/60">CAUSE</span><p className="text-foreground mt-0.5">{r.cause}</p></div>
                <div><span className="text-muted-foreground/60">EFFECT</span><p className="text-muted-foreground mt-0.5">{r.effect}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top 3 Improvement Actions */}
      <div className="glass-card rounded-2xl border border-emerald-500/20 p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Top 3 Improvement Actions
        </p>
        <div className="space-y-3">
          {actions.length === 0 ? (
            <p className="text-sm text-emerald-400 font-medium">✓ You are already following best financial practices.</p>
          ) : actions.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Action #{i + 1}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">{a.scoreGain}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                <div><span className="text-muted-foreground/60">CAUSE</span><p className="text-muted-foreground mt-0.5">{a.cause}</p></div>
                <div><span className="text-muted-foreground/60">EFFECT</span><p className="text-muted-foreground mt-0.5">{a.effect}</p></div>
                <div>
                  <span className="text-muted-foreground/60">ACTION</span>
                  <div className="flex items-start gap-1 mt-0.5">
                    <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-emerald-300">{a.action}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}