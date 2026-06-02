import { motion } from 'framer-motion';
import { Brain, TrendingUp, ShieldAlert, Wallet, PiggyBank, ReceiptText, Lock, Star, ArrowRight, Cpu, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const PREMIUM_BENEFITS = [
  'Save your financial profile',
  'Access live UAE market data',
  'Use the AI Financial Coach',
  'Track savings goals & progress',
  'Build your virtual portfolio',
];

export default function DemoPreview({ data, metrics, riskLevel, riskColor, insights, onReset }) {
  const { navigateToLogin } = useAuth();

  const stats = [
    { icon: Wallet, label: 'Monthly Income', value: `AED ${data.monthly_income.toLocaleString()}`, color: 'text-gold', border: 'border-yellow-500/20', bg: 'bg-yellow-500/10' },
    { icon: ReceiptText, label: 'Total Expenses', value: `AED ${metrics.totalExpenses.toLocaleString()}`, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
    { icon: PiggyBank, label: 'Monthly Surplus', value: `${metrics.monthlySurplus >= 0 ? '+' : ''}AED ${metrics.monthlySurplus.toLocaleString()}`, color: metrics.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400', border: metrics.monthlySurplus >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20', bg: metrics.monthlySurplus >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10' },
    { icon: ShieldAlert, label: 'Savings Rate', value: `${metrics.savingsRate}%`, color: metrics.savingsRate >= 20 ? 'text-emerald-400' : metrics.savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400', border: metrics.savingsRate >= 20 ? 'border-emerald-500/20' : 'border-amber-500/20', bg: metrics.savingsRate >= 20 ? 'bg-emerald-500/10' : 'bg-amber-500/10' },
  ];

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* ── Dashboard Preview (blurred below fold) ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="space-y-4">

        {/* Score Card */}
        <div className="glass-card rounded-2xl border border-border p-6 text-center glow-gold">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Your FINOVA Financial Score</p>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: `conic-gradient(${riskColor.hex} ${metrics.score * 3.6}deg, rgba(255,255,255,0.05) 0deg)` }}>
              <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center flex-col">
                <span className="text-3xl font-space font-bold" style={{ color: riskColor.hex }}>{metrics.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
          <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full border ${riskColor.bg} ${riskColor.border} ${riskColor.text}`}>
            {riskLevel}
          </span>
          <p className="text-xs text-muted-foreground mt-3 max-w-xs mx-auto">
            Based on your income, expenses, savings rate, and spending patterns.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`glass-card rounded-xl border ${s.border} ${s.bg} p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className={`text-sm font-bold font-space ${s.color} truncate`}>{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* 2 free AI insights */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-primary" /> AI Insights Preview
          </p>
          {insights.slice(0, 2).map((ins, i) => (
            <div key={i} className="glass-card rounded-xl border border-border p-4 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-0.5">{ins.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Blurred preview of more insights */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="space-y-2 pointer-events-none select-none" style={{ filter: 'blur(5px)', opacity: 0.5 }}>
            {insights.slice(2, 5).map((ins, i) => (
              <div key={i} className="glass-card rounded-xl border border-border p-4 flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-secondary flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-secondary rounded w-2/3 mb-2" />
                  <div className="h-2.5 bg-secondary/60 rounded w-full" />
                </div>
              </div>
            ))}
            <div className="glass-card rounded-xl border border-border p-4">
              <div className="h-3 bg-secondary rounded w-1/2 mb-2" />
              <div className="h-2.5 bg-secondary/60 rounded w-4/5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Premium Upgrade Overlay ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky bottom-4 mt-4 z-30"
      >
        <div className="glass-card rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl p-6 shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(245,196,65,0.12), 0 20px 60px rgba(0,0,0,0.5)' }}>
          
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 gold-gradient rounded-lg flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-base text-foreground">Create a Free Account to Continue</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Unlock your full dashboard, AI coaching, and market tools.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-5">
            {PREMIUM_BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={navigateToLogin}
              className="flex-1 gold-gradient text-primary-foreground py-3 rounded-xl font-space font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
            >
              <Star className="w-4 h-4" />
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={navigateToLogin}
              className="flex-1 glass-card border border-border py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              Log In to Existing Account
            </button>
          </div>

          <button onClick={onReset} className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Try again with different numbers
          </button>
        </div>
      </motion.div>
    </div>
  );
}