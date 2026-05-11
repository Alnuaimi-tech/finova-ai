import { motion } from 'framer-motion';
import { Home, PiggyBank, ShoppingBag, BarChart3, Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const iconMap = {
  home: Home,
  piggy: PiggyBank,
  shopping: ShoppingBag,
  chart: BarChart3,
  shield: Shield,
};

const typeConfig = {
  critical: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/5',
    dot: 'bg-rose-500',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    label: 'Critical',
    labelColor: 'text-rose-400',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    dot: 'bg-amber-400',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    label: 'Warning',
    labelColor: 'text-amber-400',
  },
  positive: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    label: 'Positive',
    labelColor: 'text-emerald-400',
  },
  neutral: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    dot: 'bg-blue-400',
    icon: Info,
    iconColor: 'text-blue-400',
    label: 'Info',
    labelColor: 'text-blue-400',
  },
};

export default function AIInsightCard({ insight, index }) {
  const config = typeConfig[insight.type] || typeConfig.neutral;
  const ContentIcon = iconMap[insight.icon] || BarChart3;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-4 flex gap-3`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center`}>
          <ContentIcon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <StatusIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
          <span className={`text-xs font-semibold uppercase tracking-wide ${config.labelColor}`}>
            {config.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-0.5">{insight.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
      </div>
    </motion.div>
  );
}