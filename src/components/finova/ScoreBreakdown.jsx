import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

// Weights must match calculateFinancialScore() in src/lib/financialEngine.js
// (0.35 / 0.28 / 0.27, plus an emergency-fund bonus of up to +10 points).
const bars = [
  { tkey: 'savingsRate', label: 'Savings Rate', weight: '35%', key: 'savingsScore', color: 'bg-emerald-500' },
  { tkey: 'expenseRatio', label: 'Expense Ratio', weight: '28%', key: 'expenseScore', color: 'bg-blue-500' },
  { tkey: 'spendingBehavior', label: 'Spending Behavior', weight: '27%', key: 'riskySpendScore', color: 'bg-amber-500' },
];

export default function ScoreBreakdown({ metrics }) {
  const { t } = useLanguage() || {};
  return (
    <div className="space-y-3">
      {bars.map((bar, i) => {
        const value = metrics[bar.key] ?? 0;
        return (
          <div key={bar.key}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground font-medium">{(t && t.dash && t.dash.scoreBars[bar.tkey]) || bar.label}</span>
                <span className="text-xs text-muted-foreground">({bar.weight})</span>
              </div>
              <span className="text-sm font-bold text-foreground">{value}/100</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${bar.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
        <span>{(t && t.dash && t.dash.scoreBars.emergencyBonus) || 'Emergency fund bonus'}</span>
        <span className="font-semibold text-foreground">+{metrics.emergencyBonus ?? 0}/10</span>
      </div>
    </div>
  );
}