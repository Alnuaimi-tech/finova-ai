import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, BarChart3, PiggyBank, Percent } from 'lucide-react';

export default function PortfolioSummaryCard({ totalInvested, totalCurrentValue }) {
  const totalPnL = totalCurrentValue - totalInvested;
  const pnlPct = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : '0.00';
  const isUp = totalPnL >= 0;

  const stats = [
    {
      icon: Wallet,
      label: 'Total Invested',
      value: `AED ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: BarChart3,
      label: 'Current Value',
      value: `AED ${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: 'text-gold',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
    {
      icon: isUp ? TrendingUp : TrendingDown,
      label: 'Total P&L',
      value: `${isUp ? '+' : ''}AED ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: isUp ? 'text-emerald-400' : 'text-rose-400',
      bg: isUp ? 'bg-emerald-500/10' : 'bg-rose-500/10',
      border: isUp ? 'border-emerald-500/20' : 'border-rose-500/20',
    },
    {
      icon: Percent,
      label: 'Return %',
      value: `${isUp ? '+' : ''}${pnlPct}%`,
      color: isUp ? 'text-emerald-400' : 'text-rose-400',
      bg: isUp ? 'bg-emerald-500/10' : 'bg-rose-500/10',
      border: isUp ? 'border-emerald-500/20' : 'border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`glass-card rounded-2xl border ${s.border} ${s.bg} p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className={`text-lg font-bold font-space ${s.color}`}>{s.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}