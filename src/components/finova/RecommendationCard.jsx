import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const priorityConfig = {
  urgent: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Urgent' },
  high: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'High Priority' },
  medium: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Recommended' },
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Tip' },
};

export default function RecommendationCard({ rec, index }) {
  const { t } = useLanguage() || {};
  const priorityKey = priorityConfig[rec.priority] ? rec.priority : 'low';
  const config = priorityConfig[priorityKey];
  const priorityLabel = (t && t.dash && t.dash.priorityLabels[priorityKey]) || config.label;
  const impactText = (t && t.dash) ? t.dash.impactLabel(rec.impact) : `Impact: ${rec.impact}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-xl border border-border p-4 hover:border-white/10 transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
          <Zap className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
              {priorityLabel}
            </span>
            <span className="text-xs text-muted-foreground">{impactText}</span>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">{rec.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-gold transition-colors mt-0.5 rtl:rotate-180" />
      </div>
    </motion.div>
  );
}