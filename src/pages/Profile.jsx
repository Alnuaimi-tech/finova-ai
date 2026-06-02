import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, User, RefreshCw, TrendingUp, Target, BookOpen, Brain, ChevronRight, LogOut } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import { base44 } from '@/api/base44Client';
import { calculateFinancialScore, classifyRisk, getRiskColor } from '../lib/financialEngine';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useState(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  });

  const raw = sessionStorage.getItem('finova_data');
  let data = null, metrics = null, riskLevel = '', riskColor = {};
  if (raw) {
    data = Object.fromEntries(Object.entries(JSON.parse(raw)).map(([k, v]) => [k, parseFloat(v) || 0]));
    metrics = calculateFinancialScore(data);
    riskLevel = classifyRisk(metrics.score);
    riskColor = getRiskColor(riskLevel);
  }

  const quickLinks = [
    { icon: RefreshCw, label: 'Update My Analysis', sub: 'Re-enter your income and expenses', to: '/analyze', color: 'text-gold' },
    { icon: TrendingUp, label: 'View My Dashboard', sub: 'See your full financial breakdown', to: '/dashboard', color: 'text-emerald-400' },
    { icon: BookOpen, label: 'Continue Learning', sub: 'Financial lessons and stock basics', to: '/learn', color: 'text-blue-400' },
    { icon: Brain, label: 'Ask AI Analyst', sub: 'Get personalized advice from your AI', to: '/dashboard', color: 'text-purple-400' },
  ];

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-base text-foreground tracking-tight">Profile</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 md:px-6 py-6 space-y-5">

        {/* Avatar + Name */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-border p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-space font-bold text-foreground">{user?.full_name || 'Student'}</p>
            <p className="text-sm text-muted-foreground">{user?.email || 'Loading...'}</p>
            <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">UAE Student</span>
          </div>
        </motion.div>

        {/* Financial Summary */}
        {metrics ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Your Financial Snapshot</p>
            <div className="grid grid-cols-2 gap-3">
              <div className={`glass-card rounded-2xl border p-4 text-center ${riskColor.border} ${riskColor.bg}`}>
                <p className="text-xs text-muted-foreground mb-1">FINOVA Score</p>
                <p className="text-3xl font-space font-bold" style={{ color: riskColor.hex }}>{metrics.score}</p>
                <p className={`text-xs font-semibold mt-1 ${riskColor.text}`}>{riskLevel}</p>
              </div>
              <div className="glass-card rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Monthly Savings</p>
                <p className={`text-2xl font-space font-bold ${metrics.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.monthlySurplus >= 0 ? '+' : ''}AED {Math.abs(metrics.monthlySurplus).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per month</p>
              </div>
              <div className="glass-card rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Savings Rate</p>
                <p className={`text-2xl font-space font-bold ${metrics.savingsRate >= 20 ? 'text-emerald-400' : metrics.savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {metrics.savingsRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">of income saved</p>
              </div>
              <div className="glass-card rounded-2xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Monthly Income</p>
                <p className="text-2xl font-space font-bold text-foreground">AED {data.monthly_income.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">per month</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border p-6 text-center">
            <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-2">No analysis yet</p>
            <p className="text-xs text-muted-foreground mb-4">Run your financial analysis to see your score and stats here.</p>
            <button onClick={() => navigate('/analyze')}
              className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm">
              Start Analysis
            </button>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Quick Actions</p>
          <div className="space-y-2">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <button key={i} onClick={() => navigate(link.to)}
                  className="w-full glass-card rounded-2xl border border-border p-4 flex items-center gap-4 hover:border-white/10 transition-all text-left">
                  <div className={`w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* App info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center py-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-sm text-foreground">FINOVA AI</span>
          </div>
          <p className="text-xs text-muted-foreground">Financial intelligence for UAE students · v2.0</p>
          <p className="text-xs text-muted-foreground/50 mt-1">For educational use only. Not financial advice.</p>
        </motion.div>

      </div>
      <MobileNav />
    </div>
  );
}