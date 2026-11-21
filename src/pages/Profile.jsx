import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, RefreshCw, TrendingUp, Target, BookOpen, Brain, ChevronRight, LogOut, Trophy } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import BrandLogo from '../components/finova/BrandLogo';
import LogoMark from '@/components/finova/LogoMark';
import { base44 } from '@/api/base44Client';
import { calculateFinancialScore, classifyRisk, getRiskColor } from '../lib/financialEngine';
import SkipLink from '@/components/finova/SkipLink';
import { useLanguage } from '@/lib/LanguageContext';

// Presentation only — titles and descriptions come from t.prof.badgeList.
const BADGES = [
  { id: 'first_score', icon: '🎯', condition: (metrics) => !!metrics, color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'saver', icon: '💰', condition: (metrics) => metrics?.savingsRate >= 20, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'low_risk', icon: '🛡️', condition: (metrics, rl) => rl === 'Low Risk', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'high_score', icon: '⭐', condition: (metrics) => metrics?.score >= 80, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'learner', icon: '📚', condition: () => !!sessionStorage.getItem('visited_learn'), color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'investor', icon: '📈', condition: () => !!sessionStorage.getItem('visited_market'), color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
];

const QUICK_ICONS = [
  { icon: RefreshCw, to: '/analyze', color: 'text-gold' },
  { icon: TrendingUp, to: '/dashboard', color: 'text-emerald-400' },
  { icon: BookOpen, to: '/learn', color: 'text-blue-400' },
  { icon: Brain, to: '/dashboard', color: 'text-purple-400' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const P = t.prof;
  const [user, setUser] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('visited_learn', '1');
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const raw = sessionStorage.getItem('finova_data');
  let data = null, metrics = null, riskLevel = '', riskColor = {};
  if (raw) {
    data = Object.fromEntries(Object.entries(JSON.parse(raw)).map(([k, v]) => [k, parseFloat(v) || 0]));
    metrics = calculateFinancialScore(data);
    riskLevel = classifyRisk(metrics.score);
    riskColor = getRiskColor(riskLevel);
  }

  const earnedBadges = BADGES.filter(b => b.condition(metrics, riskLevel));
  const totalBadges = BADGES.length;

  const handleLogout = () => base44.auth.logout('/');

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SkipLink />
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="font-space font-bold text-base text-foreground tracking-tight">{P.title}</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">
            <LogOut className="w-3.5 h-3.5 rtl:-scale-x-100" />
            {P.signOut}
          </button>
        </div>
      </header>

      <main id="main-content" className="max-w-xl mx-auto px-4 md:px-6 py-6 space-y-5">

        {/* Avatar + Name */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-border p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-space font-bold text-foreground truncate">{user?.full_name || P.student}</p>
            <p className="text-sm text-muted-foreground truncate" dir="ltr">{user?.email || P.loading}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">🇦🇪 {P.uaeStudent}</span>
              {earnedBadges.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium flex items-center gap-1">
                  <Trophy className="w-3 h-3" />{P.badgesCount(earnedBadges.length)}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Financial Summary */}
        {metrics ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">{P.snapshot}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className={`glass-card rounded-2xl border p-4 text-center ${riskColor.border} ${riskColor.bg}`}>
                <p className="text-xs text-muted-foreground mb-1">{P.score}</p>
                <p className="text-3xl font-space font-bold" style={{ color: riskColor.hex }}>{metrics.score}</p>
                <p className={`text-xs font-semibold mt-1 ${riskColor.text}`}>{t.dash.risk[riskLevel] || riskLevel}</p>
              </div>
              <div className="glass-card rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{P.surplus}</p>
                <p className={`text-2xl font-space font-bold ${metrics.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} dir="ltr">
                  {metrics.monthlySurplus >= 0 ? '+' : ''}AED {Math.abs(metrics.monthlySurplus).toLocaleString('en-US')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{P.perMonth}</p>
              </div>
              <div className="glass-card rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{P.savingsRate}</p>
                <p className={`text-2xl font-space font-bold ${metrics.savingsRate >= 20 ? 'text-emerald-400' : metrics.savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {metrics.savingsRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">{P.ofIncomeSaved}</p>
              </div>
              <div className="glass-card rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{P.income}</p>
                <p className="text-2xl font-space font-bold text-foreground" dir="ltr">AED {data.monthly_income.toLocaleString('en-US')}</p>
                <p className="text-xs text-muted-foreground mt-1">{P.perMonth}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border p-6 text-center">
            <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-2">{P.noAnalysis}</p>
            <p className="text-xs text-muted-foreground mb-4">{P.noAnalysisDesc}</p>
            <button onClick={() => navigate('/analyze')}
              className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm">
              {P.startAnalysis}
            </button>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{P.badgesTitle}</p>
            <span className="text-xs text-muted-foreground">{P.earned(earnedBadges.length, totalBadges)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {BADGES.map((badge, i) => {
              const earned = badge.condition(metrics, riskLevel);
              const copy = P.badgeList[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                  className={`glass-card rounded-xl border p-3 text-center transition-all ${earned ? `${badge.border} ${badge.bg}` : 'border-border opacity-40'}`}>
                  <div className="text-2xl mb-1.5">{badge.icon}</div>
                  <p className={`text-xs font-semibold ${earned ? badge.color : 'text-muted-foreground'} leading-tight`}>{copy.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">{copy.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">{P.quickTitle}</p>
          <div className="space-y-2">
            {QUICK_ICONS.map((link, i) => {
              const Icon = link.icon;
              const copy = P.quick[i];
              return (
                <button key={i} onClick={() => navigate(link.to)}
                  className="w-full glass-card rounded-2xl border border-border p-4 flex items-center gap-4 hover:border-white/10 transition-all text-start">
                  <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{copy.label}</p>
                    <p className="text-xs text-muted-foreground">{copy.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 rtl:rotate-180" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* App info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center py-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LogoMark size={28} />
            <span className="font-space font-bold text-sm text-foreground">FINOVA AI</span>
          </div>
          <p className="text-xs text-muted-foreground">{P.tagline}</p>
          <p className="text-xs text-muted-foreground/50 mt-1">{P.note}</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <button onClick={() => navigate('/terms')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.common.terms}</button>
            <span className="text-border text-xs">·</span>
            <button onClick={() => navigate('/privacy')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.common.privacy}</button>
            <span className="text-border text-xs">·</span>
            <button onClick={() => navigate('/about')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.common.about}</button>
            <span className="text-border text-xs">·</span>
            <button onClick={() => navigate('/contact')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t.common.contact}</button>
          </div>
        </motion.div>
      </main>
      <MobileNav />
    </div>
  );
}