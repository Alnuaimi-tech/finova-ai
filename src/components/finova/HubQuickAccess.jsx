import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, LayoutDashboard, TrendingUp, BookOpen, User } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const HUBS = [
  { to: '/analyze', icon: Cpu, key: 'analyze', color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { to: '/market', icon: TrendingUp, key: 'market', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { to: '/learn', icon: BookOpen, key: 'learn', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { to: '/profile', icon: User, key: 'profile', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
];

export default function HubQuickAccess() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-6 pb-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t.hubTitle}</p>
          <span className="text-[10px] text-muted-foreground">{t.hubHint}</span>
        </div>
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
          {HUBS.map((hub, i) => {
            const Icon = hub.icon;
            return (
              <motion.button
                key={hub.to}
                onClick={() => navigate(hub.to)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex flex-col items-center gap-2 glass-card rounded-2xl border ${hub.border} p-2.5 sm:p-3.5 hover:bg-white/4 transition-all group`}
              >
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${hub.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${hub.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-[11px] sm:text-xs font-bold text-foreground font-space leading-none">{t.hub[hub.key].label}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight mt-0.5 hidden sm:block">{t.hub[hub.key].desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}