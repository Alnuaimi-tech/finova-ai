import { motion } from 'framer-motion';
import { Database, Cpu, BarChart3, AlertTriangle, TrendingUp, Lightbulb, GraduationCap } from 'lucide-react';

const steps = [
  { icon: Database, label: 'User Input', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Cpu, label: 'Processing', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: BarChart3, label: 'AI Analysis', color: 'text-gold', bg: 'bg-yellow-500/10' },
  { icon: AlertTriangle, label: 'Risk Score', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: TrendingUp, label: 'Prediction', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Lightbulb, label: 'Insights', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: GraduationCap, label: 'Education', color: 'text-sky-400', bg: 'bg-sky-500/10' },
];

export default function AIPipeline({ activeStep = -1 }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max mx-auto justify-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          return (
            <div key={i} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive ? `${step.bg} ring-1 ring-white/10` : ''
                } ${isPast ? 'opacity-50' : ''}`}
              >
                <div className={`w-9 h-9 rounded-lg ${step.bg} flex items-center justify-center ${
                  isActive ? 'ring-1 ring-white/20' : ''
                }`}>
                  <Icon className={`w-4 h-4 ${step.color} ${isActive ? 'pulse-glow' : ''}`} />
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? step.color : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="flex items-center">
                  <div className={`h-px w-6 transition-all duration-500 ${
                    i < activeStep ? 'bg-gold/60' : 'bg-border'
                  }`} />
                  <div className={`text-xs transition-all duration-500 ${
                    i < activeStep ? 'text-gold/60' : 'text-border'
                  }`}>›</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}