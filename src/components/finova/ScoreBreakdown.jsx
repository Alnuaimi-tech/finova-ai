import { motion } from 'framer-motion';

const bars = [
  { label: 'Savings Rate', weight: '40%', key: 'savingsScore', color: 'bg-emerald-500' },
  { label: 'Expense Ratio', weight: '30%', key: 'expenseScore', color: 'bg-blue-500' },
  { label: 'Spending Behavior', weight: '30%', key: 'riskySpendScore', color: 'bg-amber-500' },
];

export default function ScoreBreakdown({ metrics }) {
  return (
    <div className="space-y-3">
      {bars.map((bar, i) => {
        const value = metrics[bar.key] ?? 0;
        return (
          <div key={bar.key}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground font-medium">{bar.label}</span>
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
    </div>
  );
}