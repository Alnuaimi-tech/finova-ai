import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, BookOpen, DollarSign, Shield, TrendingUp, CreditCard, Lightbulb,
  GraduationCap, BarChart3, AlertTriangle, CheckCircle2, XCircle, MinusCircle,
  ChevronDown, Zap, Target, Home, Car, Phone, Calculator
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MobileNav from '../components/finova/MobileNav';
import BrandLogo from '../components/finova/BrandLogo';

const modules = [
  {
    icon: DollarSign, color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', tag: 'Budgeting',
    title: 'The 50/30/20 Rule',
    desc: 'The most widely taught personal finance framework — and it works perfectly for UAE student budgets.',
    points: [
      '50% → Needs: rent, food, transport (e.g. AED 2,500 on AED 5,000 salary)',
      '30% → Wants: shopping, dining, subscriptions (e.g. AED 1,500)',
      '20% → Savings + investments (e.g. AED 1,000/month)',
    ],
    tip: '💡 UAE Tip: Many students spend 70%+ on rent alone. Consider shared accommodation near campus.',
  },
  {
    icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', tag: 'Safety Net',
    title: 'Emergency Fund',
    desc: 'A financial buffer that protects you from unexpected expenses — job loss, medical, or urgent travel.',
    points: [
      'Target: 3–6 months of living expenses in AED',
      'Keep it in a UAE savings account (FAB, Emirates NBD, ADCB)',
      'Do NOT invest your emergency fund in stocks',
      'Start small — even AED 500/month builds up fast',
    ],
    tip: '💡 UAE Tip: Many UAE banks offer zero-fee savings accounts. Check ADCB iSave or FAB iSave.',
  },
  {
    icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', tag: 'Investing',
    title: 'Compound Interest',
    desc: "The most powerful financial concept. Starting early — even with AED 200/month — makes a huge difference.",
    points: [
      'AED 200/month at 7% return = AED 121,000 in 20 years',
      'UAE platforms: Sarwa, StashAway, National Bonds',
      'ADX and DFM for UAE stock market investing',
      'Time in market > timing the market',
    ],
    tip: '💡 UAE Tip: National Bonds is a Sharia-compliant savings tool with prizes — popular with UAE students.',
  },
  {
    icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', tag: 'Debt Trap',
    title: 'BNPL & Credit Cards',
    desc: "Buy-Now-Pay-Later services like Tabby and Spotii are everywhere in UAE. Here's what students must know.",
    points: [
      'BNPL feels free but splits spending into debt installments',
      'UAE credit card interest: 18–36% annually',
      'Missing one payment triggers fees and affects credit score',
      'Rule: Only use credit if you can pay 100% next month',
    ],
    tip: '⚠️ Warning: Using Tabby for Namshi shopping while having no emergency fund is high financial risk.',
  },
  {
    icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', tag: 'UAE Perks',
    title: 'UAE Student Benefits',
    desc: "Financial perks available to UAE students that most people never use.",
    points: [
      'RTA Nol Student Card: discounted metro & bus fares',
      'Student bank accounts: zero fees at most UAE banks',
      'ADGM & SCA free financial literacy workshops',
      'University meal plans are cheaper than daily dining out',
    ],
    tip: '💡 UAE Tip: The RTA Student Nol Card saves up to AED 200/month for regular commuters.',
  },
  {
    icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', tag: 'Income',
    title: 'Earn Extra Income in UAE',
    desc: 'Legal ways for UAE students and young professionals to earn additional income.',
    points: [
      'Freelancing on Upwork & Fiverr (legal for UAE residents)',
      'Campus jobs and part-time roles (check university policies)',
      'Selling digital products, notes, or tutoring services',
      'Internships at UAE startups often include paid stipends',
    ],
    tip: '💡 UAE Tip: Register as a freelancer via UAE Free Zones (like Dubai Internet City) for as low as AED 7,500/year.',
  },
  {
    icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', tag: 'Housing',
    title: 'Rent & Accommodation',
    desc: "Rent is the biggest expense for most UAE students and young professionals.",
    points: [
      'Studio in Dubai: AED 3,000–5,000/month',
      'Shared flat per room: AED 1,200–2,500/month',
      'Campus housing (UAEU, Khalifa): AED 500–1,500/month',
      'Al Ain and Sharjah are 40-60% cheaper than Dubai',
    ],
    tip: '💡 UAE Tip: DEWA bills and service charges add 15–20% on top of rent. Always budget for them.',
  },
  {
    icon: Car, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', tag: 'Transport',
    title: 'Getting Around in UAE',
    desc: 'Transport costs vary hugely depending on where you live and how you travel.',
    points: [
      'Metro monthly pass: AED 350 (Gold Class: AED 600)',
      'Uber/Careem: AED 800–1,500/month for daily use',
      'Car ownership: loan + fuel + Salik + insurance = AED 3,000+/month',
      'Abu Dhabi to Dubai daily commute: ~AED 1,200/month in fuel',
    ],
    tip: '💡 UAE Tip: Metro + walking is 5–10x cheaper than Uber. Consider it seriously if you live near a metro line.',
  },
  {
    icon: Phone, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', tag: 'Subscriptions',
    title: 'Mobile & Subscriptions',
    desc: 'Subscriptions are a silent budget drain. Here are UAE-typical monthly costs to watch.',
    points: [
      'Etisalat/e& plan: AED 149–299/month',
      'du mobile plan: AED 125–249/month',
      'Netflix + Spotify + OSN+: AED 80–150/month combined',
      'Review all subscriptions quarterly — cancel unused ones',
    ],
    tip: '💡 UAE Tip: Many UAE operators offer student plans with extra data at reduced prices. Always ask.',
  },
];

function getReadiness(score) {
  if (score >= 70) return { label: 'Ready to Invest', sub: 'Your finances are strong enough to start.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', Icon: CheckCircle2 };
  if (score >= 40) return { label: 'Build Savings First', sub: 'Improve your stability before investing.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', Icon: MinusCircle };
  return { label: 'Not Recommended Yet', sub: 'Focus on reducing expenses and emergency fund first.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', Icon: XCircle };
}

const TABS = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'stocks', label: 'Investing', icon: BarChart3 },
  { id: 'simulator', label: 'Simulator', icon: Calculator },
];

export default function Learn() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lessons');
  const [expanded, setExpanded] = useState(null);
  const [monthly, setMonthly] = useState('200');
  const [months, setMonths] = useState('24');

  const m = parseFloat(monthly) || 0;
  const n = parseInt(months) || 0;
  const monthlyRate = 0.07 / 12;
  const totalInvested = m * n;
  const futureValue = monthlyRate > 0 ? m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) : totalInvested;
  const estimatedGrowth = futureValue - totalInvested;

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

  const chartData = useMemo(() => {
    const points = Math.min(n, 60);
    return Array.from({ length: points + 1 }, (_, i) => ({
      month: i === 0 ? 'Now' : `M${i}`,
      value: i === 0 ? 0 : Math.round(m * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate)),
      invested: m * i,
    }));
  }, [m, n, monthlyRate]);

  const stockTypes = [
    { name: 'Blue Chip (ADNOC, Emaar, FAB)', exchange: 'ADX / DFM', risk: 'Low Risk', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10', desc: 'Stable, large companies. Lower but consistent returns. Best for beginners.' },
    { name: 'Growth Stocks (Tech, Real Estate)', exchange: 'ADX / DFM', risk: 'Medium Risk', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10', desc: 'Higher growth potential. Prices can swing with market news and global events.' },
    { name: 'New IPOs / Small Caps', exchange: 'ADX / DFM', risk: 'High Risk', riskColor: 'text-rose-400', riskBg: 'bg-rose-500/10', desc: 'Could multiply — or drop significantly. Only invest what you can lose.' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="font-space font-bold text-base text-foreground tracking-tight">Learn</span>
            <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5 hidden sm:inline">UAE Financial Literacy</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-5">
        {/* Welcome banner */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">UAE Financial Literacy Hub</p>
            <p className="text-xs text-muted-foreground">9 modules · AED-based examples · Built for UAE students & young professionals</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl border border-border mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'lessons' && (
            <motion.div key="lessons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{modules.length} lessons available</p>
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const open = expanded === i;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`glass-card rounded-2xl border ${open ? 'border-white/10' : 'border-border'} overflow-hidden`}>
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/2 transition-colors text-left"
                      onClick={() => setExpanded(open ? null : i)}>
                      <div className={`w-10 h-10 rounded-xl ${mod.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${mod.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mod.bg} ${mod.color} border ${mod.border}`}>{mod.tag}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{mod.title}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
                        <ul className="space-y-2">
                          {mod.points.map((pt, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${mod.color.replace('text-', 'bg-')}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                        {mod.tip && (
                          <div className={`rounded-xl ${mod.bg} border ${mod.border} px-4 py-3 text-xs ${mod.color} font-medium`}>
                            {mod.tip}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center mt-4">
                <Target className="w-8 h-8 text-gold mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground mb-1">Ready to check your real numbers?</p>
                <p className="text-xs text-muted-foreground mb-4">Apply what you learned and get your personal FINOVA score.</p>
                <button onClick={() => navigate('/analyze')}
                  className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                  Analyze My Finances
                </button>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'stocks' && (
            <motion.div key="stocks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4">
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

              <div className="glass-card rounded-2xl border border-border p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground font-space">Investing in the UAE</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The UAE has two main stock exchanges: the <strong className="text-foreground">Abu Dhabi Securities Exchange (ADX)</strong> and the <strong className="text-foreground">Dubai Financial Market (DFM)</strong>. Both are regulated by the Securities and Commodities Authority (SCA).
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-xs text-center">
                  {[
                    { label: 'Buy @ AED 100', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                    { label: 'Price rises to AED 120', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                    { label: 'Profit = +AED 20 (20%)', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  ].map((s, i) => (
                    <div key={i} className={`flex-1 rounded-xl px-3 py-2 font-medium border ${s.color}`}>{s.label}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Types of Investments</p>
                {stockTypes.map((s, i) => (
                  <div key={i} className="glass-card rounded-2xl border border-border p-4 flex items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.riskBg} ${s.riskColor} flex-shrink-0`}>{s.risk}</span>
                        <span className="text-xs text-muted-foreground">{s.exchange}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
                <p className="text-sm font-semibold text-rose-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Important Warnings</p>
                {[
                  "Don't invest if your FINOVA score is below 40 — build savings first.",
                  "Never invest borrowed money, BNPL credit, or your emergency fund.",
                  "Only invest money you don't need for at least 3–5 years.",
                  "Diversify across sectors — don't put everything in one company.",
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
                Explore UAE Stock Market
              </button>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div key="simulator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <div className="glass-card rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2.5 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground font-space">Investment Growth Simulator</p>
                </div>
                <p className="text-xs text-muted-foreground mb-5">See how small monthly amounts grow over time at 7% average annual return (UAE market average).</p>

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
                  {[
                    { label: 'You Invest', value: `AED ${totalInvested.toLocaleString()}`, color: 'text-foreground', bg: 'bg-secondary/30', border: 'border-border' },
                    { label: 'Growth', value: `+AED ${Math.round(estimatedGrowth).toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Total Value', value: `AED ${Math.round(futureValue).toLocaleString()}`, color: 'text-gold', bg: 'bg-primary/10', border: 'border-primary/20' },
                  ].map((s, i) => (
                    <div key={i} className={`rounded-xl ${s.bg} border ${s.border} p-3 text-center`}>
                      <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                      <p className={`text-sm font-bold font-space ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

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
                      <Line type="monotone" dataKey="invested" stroke="#475569" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                      <Line type="monotone" dataKey="value" stroke="hsl(43,96%,56%)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                <p className="text-xs text-muted-foreground text-center mt-3">* 7% average annual return estimate. Not financial advice. Past performance ≠ future results.</p>
              </div>

              {/* Quick presets */}
              <div className="glass-card rounded-2xl border border-border p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Quick Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Coffee Savings', desc: 'Skip 1 coffee/day', monthly: '150', months: '24' },
                    { label: 'Student Saver', desc: 'Typical student budget', monthly: '300', months: '36' },
                    { label: 'Young Pro', desc: 'Entry-level professional', monthly: '800', months: '60' },
                    { label: 'Serious Saver', desc: '20% of AED 5k salary', monthly: '1000', months: '120' },
                  ].map((p, i) => (
                    <button key={i} onClick={() => { setMonthly(p.monthly); setMonths(p.months); }}
                      className="glass-card rounded-xl border border-border p-3 text-left hover:border-white/10 transition-all">
                      <p className="text-xs font-semibold text-foreground">{p.label}</p>
                      <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                      <p className="text-xs text-primary font-medium mt-1">AED {p.monthly}/mo × {p.months} months</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MobileNav />
    </div>
  );
}