import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, BookOpen, DollarSign, Shield, TrendingUp, CreditCard, Lightbulb,
  GraduationCap, BarChart3, AlertTriangle, CheckCircle2, XCircle, MinusCircle,
  ChevronDown, Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MobileNav from '../components/finova/MobileNav';

// ─── Education Modules ───────────────────────────────────────────────────────
const modules = [
  {
    icon: DollarSign, color: 'text-gold', bg: 'bg-yellow-500/10', tag: 'Budgeting',
    title: 'The 50/30/20 Rule',
    desc: 'The most widely taught personal finance framework in UAE universities.',
    points: ['50% → Needs (rent, food, transport)', '30% → Wants (shopping, dining out)', '20% → Savings and investments'],
  },
  {
    icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', tag: 'Safety Net',
    title: 'Emergency Fund',
    desc: 'A financial buffer that protects you from unexpected expenses.',
    points: ['Target: 3–6 months of living expenses', 'Keep it liquid (savings account)', 'Never invest your emergency fund'],
  },
  {
    icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', tag: 'Investing',
    title: 'Compound Interest',
    desc: 'The most powerful financial concept for students to understand early.',
    points: ['Start investing early — even AED 200/month', 'UAE platforms: StashAway, Sarwa', 'Time in market > timing the market'],
  },
  {
    icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10', tag: 'Debt',
    title: 'Debt Awareness',
    desc: 'Understanding the true cost of credit and buy-now-pay-later schemes.',
    points: ['BNPL services (Tabby, Spotii) create spending traps', 'Credit card interest: 18–36% in UAE', 'Good debt vs. bad debt explained'],
  },
  {
    icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/10', tag: 'UAE Tips',
    title: 'UAE Student Benefits',
    desc: "Financial perks available to UAE students that many don't use.",
    points: ['RTA student discount cards for transport', 'Free ADGM financial literacy workshops', 'University meal plans vs. dining out'],
  },
  {
    icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10', tag: 'Income',
    title: 'Earn Extra Income',
    desc: 'How UAE students can legally earn additional income.',
    points: ['Freelancing on Upwork & Fiverr (legal for UAE residents)', 'Campus employment opportunities', 'Selling digital products & services'],
  },
];

// ─── Stock Readiness ─────────────────────────────────────────────────────────
function getReadiness(score) {
  if (score >= 70) return { label: 'Ready to Invest', sub: 'Your finances are strong enough to start.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', Icon: CheckCircle2 };
  if (score >= 40) return { label: 'Build Savings First', sub: 'Improve your stability before investing.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', Icon: MinusCircle };
  return { label: 'Not Recommended Yet', sub: 'Focus on reducing expenses and emergency fund first.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', Icon: XCircle };
}

const TABS = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'stocks', label: 'Stocks', icon: BarChart3 },
  { id: 'simulator', label: 'Simulator', icon: Zap },
];

export default function Learn() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lessons');
  const [expanded, setExpanded] = useState(null);

  // Simulator state
  const [monthly, setMonthly] = useState('200');
  const [months, setMonths] = useState('12');
  const m = parseFloat(monthly) || 0;
  const n = parseInt(months) || 0;
  const monthlyRate = 0.07 / 12;
  const totalInvested = m * n;
  const futureValue = monthlyRate > 0 ? m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) : totalInvested;
  const estimatedGrowth = futureValue - totalInvested;

  // Readiness from session
  const raw = sessionStorage.getItem('finova_data');
  let score = null;
  if (raw) {
    const d = Object.fromEntries(Object.entries(JSON.parse(raw)).map(([k, v]) => [k, parseFloat(v) || 0]));
    const total = (d.rent||0)+(d.food||0)+(d.transport||0)+(d.shopping||0)+(d.other||0);
    const surplus = d.monthly_income - total;
    const savingsRate = d.monthly_income > 0 ? (surplus / d.monthly_income) * 100 : 0;
    const expRatio = d.monthly_income > 0 ? (total / d.monthly_income) * 100 : 100;
    const shopRatio = d.monthly_income > 0 ? (d.shopping||0) / d.monthly_income * 100 : 0;
    score = Math.round(Math.max(0, Math.min(100,
      Math.max(0, Math.min(100, (savingsRate/20)*100)) * 0.4 +
      Math.max(0, Math.min(100, ((100-expRatio)/30)*100)) * 0.3 +
      Math.max(0, Math.min(100, ((20-shopRatio)/20)*100)) * 0.3
    )));
  }
  const readiness = score !== null ? getReadiness(score) : null;

  // Chart data
  const chartData = useMemo(() => {
    const points = Math.min(n, 60);
    return Array.from({ length: points + 1 }, (_, i) => ({
      month: i === 0 ? 'Now' : `M${i}`,
      value: i === 0 ? 0 : Math.round(m * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate)),
      invested: m * i,
    }));
  }, [m, n, monthlyRate]);

  const stockTypes = [
    { name: 'Blue Chip (e.g. ADNOC)', risk: 'Low Risk', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10', desc: 'Stable, large companies. Good for beginners. Lower but consistent returns.' },
    { name: 'Tech Companies', risk: 'Medium Risk', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10', desc: 'Higher growth potential. Prices can swing with news.' },
    { name: 'Startups / New IPOs', risk: 'High Risk', riskColor: 'text-rose-400', riskBg: 'bg-rose-500/10', desc: 'Could multiply — or go to zero. Only invest what you can afford to lose.' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-base text-foreground tracking-tight">Learn</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-5">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl border border-border mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── LESSONS ── */}
          {activeTab === 'lessons' && (
            <motion.div key="lessons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4">
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const open = expanded === i;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl border border-border overflow-hidden">
                    <button className="w-full flex items-center gap-4 p-5 hover:bg-white/2 transition-colors text-left"
                      onClick={() => setExpanded(open ? null : i)}>
                      <div className={`w-11 h-11 rounded-xl ${mod.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${mod.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mod.bg} ${mod.color}`}>{mod.tag}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{mod.desc}</p>
                        <ul className="space-y-2">
                          {mod.points.map((pt, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${mod.color.replace('text-', 'bg-')}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center mt-4">
                <GraduationCap className="w-8 h-8 text-gold mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground mb-1">Ready to check your finances?</p>
                <p className="text-xs text-muted-foreground mb-4">Apply what you learned and get your personal score.</p>
                <button onClick={() => navigate('/analyze')}
                  className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                  Analyze My Finances
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── STOCKS ── */}
          {activeTab === 'stocks' && (
            <motion.div key="stocks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4">

              {/* Investment Readiness */}
              {readiness ? (
                <div className={`glass-card rounded-2xl border ${readiness.border} ${readiness.bg} p-5 flex items-center gap-4`}>
                  <readiness.Icon className={`w-10 h-10 ${readiness.color} flex-shrink-0`} />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Your FINOVA Score: {score}/100</p>
                    <p className={`text-lg font-space font-bold ${readiness.color}`}>{readiness.label}</p>
                    <p className="text-sm text-muted-foreground">{readiness.sub}</p>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl border border-border p-5 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Run your financial analysis to check your investment readiness.</p>
                  <button onClick={() => navigate('/analyze')} className="gold-gradient text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium">
                    Run Analysis
                  </button>
                </div>
              )}

              {/* What is a stock */}
              <div className="glass-card rounded-2xl border border-border p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground font-space">What is a Stock?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">A stock is a small ownership share in a company. When you buy a stock, you become part-owner and share in its profits and losses.</p>
                <div className="flex flex-col sm:flex-row gap-2 text-xs text-center">
                  {[
                    { label: 'Buy @ AED 100', color: 'bg-blue-500/10 text-blue-400' },
                    { label: '→ Price rises', color: 'bg-amber-500/10 text-amber-400' },
                    { label: 'Sell @ AED 120 = +AED 20', color: 'bg-emerald-500/10 text-emerald-400' },
                  ].map((s, i) => (
                    <div key={i} className={`flex-1 rounded-xl px-3 py-2 font-medium ${s.color}`}>{s.label}</div>
                  ))}
                </div>
              </div>

              {/* Stock Types */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Types of Stocks</p>
                {stockTypes.map((s, i) => (
                  <div key={i} className="glass-card rounded-2xl border border-border p-4 flex items-start gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.riskBg} ${s.riskColor} flex-shrink-0 mt-0.5`}>{s.risk}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              <div className="glass-card rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-rose-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Important Warnings</p>
                {[
                  "Don't invest if your FINOVA score is below 40.",
                  "Never invest borrowed money or BNPL credit.",
                  "Only invest money you don't need for 3–5 years.",
                  "Diversify — don't put everything in one stock.",
                ].map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    {w}
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/market')}
                className="w-full gold-gradient text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <TrendingUp className="w-4 h-4" />
                View UAE Stock Market
              </button>
            </motion.div>
          )}

          {/* ── SIMULATOR ── */}
          {activeTab === 'simulator' && (
            <motion.div key="simulator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <div className="glass-card rounded-2xl border border-border p-5">
                <p className="text-sm font-semibold text-foreground font-space mb-1">Investment Simulator</p>
                <p className="text-xs text-muted-foreground mb-5">See how small monthly amounts grow over time at 7% average annual return.</p>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-2">Monthly Amount (AED)</label>
                    <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} min="0"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-sm focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-2">Number of Months</label>
                    <input type="number" value={months} onChange={e => setMonths(e.target.value)} min="1" max="360"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-sm focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="rounded-xl bg-secondary/30 border border-border p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Invested</p>
                    <p className="text-base font-bold text-foreground font-space">AED {totalInvested.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Growth</p>
                    <p className="text-base font-bold text-emerald-400 font-space">+{Math.round(estimatedGrowth).toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">Total Value</p>
                    <p className="text-base font-bold text-gold font-space">AED {Math.round(futureValue).toLocaleString()}</p>
                  </div>
                </div>

                {/* Chart */}
                {chartData.length > 1 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
                        interval={Math.max(1, Math.floor(chartData.length / 5) - 1)} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
                        tickFormatter={v => `${(v/1000).toFixed(0)}k`} width={32} />
                      <Tooltip formatter={(v, name) => [`AED ${v?.toLocaleString()}`, name === 'value' ? 'Portfolio Value' : 'Amount Invested']}
                        contentStyle={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,30%,16%)', borderRadius: '12px', fontSize: 12 }}
                        labelStyle={{ color: '#94a3b8' }} />
                      <Legend formatter={v => <span className="text-xs text-muted-foreground">{v === 'value' ? 'Portfolio Value' : 'Amount Invested'}</span>} iconType="circle" iconSize={7} />
                      <Line type="monotone" dataKey="invested" stroke="#475569" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                      <Line type="monotone" dataKey="value" stroke="hsl(43,96%,56%)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                <p className="text-xs text-muted-foreground text-center mt-3">* 7% average annual return estimate. Not financial advice.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <MobileNav />
    </div>
  );
}