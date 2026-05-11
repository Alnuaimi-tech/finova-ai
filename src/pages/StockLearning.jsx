import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Cpu, ArrowLeft, TrendingUp, Brain, AlertTriangle, BookOpen,
  DollarSign, BarChart3, Shield, Zap, CheckCircle2, XCircle, MinusCircle,
  ChevronDown, ChevronUp
} from 'lucide-react';

// ─── AI Readiness Logic ───────────────────────────────────────────────────────
function getReadiness(score) {
  if (score >= 70) return {
    label: 'Ready to Invest',
    sublabel: 'Your financial stability is strong enough to start investing.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
  };
  if (score >= 40) return {
    label: 'Improve Savings First',
    sublabel: 'Build your financial stability before allocating money to stocks.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: MinusCircle,
    iconColor: 'text-amber-400',
  };
  return {
    label: 'Not Recommended',
    sublabel: 'Focus on reducing expenses and building an emergency fund first.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: XCircle,
    iconColor: 'text-rose-400',
  };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const basics = [
  {
    icon: BarChart3, color: 'text-gold', bg: 'bg-yellow-500/10',
    title: 'What is a Stock?',
    text: 'A stock is a small ownership share in a company. When you buy a stock, you become a part-owner of that business and share in its profits and losses.',
  },
  {
    icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10',
    title: 'What is Investing?',
    text: 'Investing means putting your money into assets (like stocks) with the expectation of growing it over time. Unlike saving, investing carries risk but offers higher potential returns.',
  },
  {
    icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10',
    title: 'Saving vs. Investing',
    text: 'Saving keeps money safe with low return (bank account). Investing grows money faster but with risk. You need savings first — then invest the extra.',
  },
  {
    icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10',
    title: 'What is Risk?',
    text: 'Risk is the chance that an investment loses value. Higher potential return = higher risk. As a student, always start with low-risk, long-term investments.',
  },
];

const exampleStocks = [
  { name: 'Tech Company (e.g. Apple)', risk: 'Medium Risk', riskColor: 'text-amber-400', riskBg: 'bg-amber-500/10', riskBorder: 'border-amber-500/20', return: 'Moderate–High', volatile: true, desc: 'High growth potential but price can swing rapidly with market news.' },
  { name: 'Energy / Utilities', risk: 'Low Risk', riskColor: 'text-emerald-400', riskBg: 'bg-emerald-500/10', riskBorder: 'border-emerald-500/20', return: 'Stable', volatile: false, desc: 'Consistent dividends, slower growth. Ideal for beginners.' },
  { name: 'Startup / New Company', risk: 'High Risk', riskColor: 'text-rose-400', riskBg: 'bg-rose-500/10', riskBorder: 'border-rose-500/20', return: 'High / Loss', volatile: true, desc: 'Could multiply — or go to zero. Never invest money you cannot afford to lose.' },
];

const warnings = [
  { text: 'Do not invest if your financial stability score is below 40.', icon: XCircle },
  { text: 'Never invest borrowed money or BNPL credit (e.g. Tabby, Spotii).', icon: XCircle },
  { text: 'Only invest money you do not need for the next 3–5 years.', icon: XCircle },
  { text: 'Avoid following social media "hot stock" trends blindly.', icon: XCircle },
  { text: 'Diversify — never put all savings into a single stock.', icon: XCircle },
];

const uaeTips = [
  { icon: '🇦🇪', title: 'Start Extremely Small', text: 'Platforms like StashAway and Sarwa allow investments from AED 100. Start small and learn.' },
  { icon: '📚', title: 'Learn Before You Invest', text: 'Complete ADGM financial literacy workshops (free for UAE residents) before risking real money.' },
  { icon: '🧘', title: 'Be Patient', text: 'UAE students often expect quick returns. Real investing is long-term — think 3–10 years, not 3 weeks.' },
  { icon: '✅', title: 'Use Regulated Platforms', text: 'Only use platforms regulated by SCA (Securities and Commodities Authority) or ADGM/DIFC.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StockLearning() {
  const navigate = useNavigate();

  // Inline score calculation
  const raw = sessionStorage.getItem('finova_data');
  let score = null;
  if (raw) {
    const parsed = JSON.parse(raw);
    const d = Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, parseFloat(v) || 0]));
    const totalExpenses = (d.rent || 0) + (d.food || 0) + (d.transport || 0) + (d.shopping || 0) + (d.other || 0);
    const monthlySurplus = d.monthly_income - totalExpenses;
    const savingsRate = d.monthly_income > 0 ? (monthlySurplus / d.monthly_income) * 100 : 0;
    const expenseRatio = d.monthly_income > 0 ? (totalExpenses / d.monthly_income) * 100 : 100;
    const shoppingRatio = d.monthly_income > 0 ? (d.shopping || 0) / d.monthly_income * 100 : 0;
    const savingsScore = Math.max(0, Math.min(100, (savingsRate / 20) * 100));
    const expenseScore = Math.max(0, Math.min(100, ((100 - expenseRatio) / 30) * 100));
    const riskySpendScore = Math.max(0, Math.min(100, ((20 - shoppingRatio) / 20) * 100));
    score = Math.round(Math.max(0, Math.min(100, savingsScore * 0.4 + expenseScore * 0.3 + riskySpendScore * 0.3)));
  }

  const readiness = score !== null ? getReadiness(score) : null;
  const ReadinessIcon = readiness?.icon;

  // Simulator state
  const [monthly, setMonthly] = useState('200');
  const [months, setMonths] = useState('12');
  const annualReturn = 0.07; // 7% annual = ~0.583% monthly
  const m = parseFloat(monthly) || 0;
  const n = parseInt(months) || 0;
  const totalInvested = m * n;
  const monthlyRate = annualReturn / 12;
  const futureValue = monthlyRate > 0
    ? m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
    : totalInvested;
  const estimatedGrowth = futureValue - totalInvested;

  // Stock example expanded state
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-lg text-foreground tracking-tight">FINOVA AI</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* ── Page Title ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <TrendingUp className="w-3 h-3" />
            AI-Guided Financial Education
          </div>
          <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground mb-3">
            Stock Learning &amp; Smart Investing
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Learn how stocks work, understand your readiness to invest, and use our AI-powered simulator — all designed for UAE students.
          </p>
        </motion.div>

        {/* ── 1. Basics ── */}
        <section>
          <SectionHeader icon={BookOpen} label="Basics" title="Understand the Fundamentals" color="text-gold" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {basics.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-card rounded-2xl border border-border p-5">
                  <div className={`w-9 h-9 rounded-xl ${b.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${b.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 font-space">{b.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── 2. How Stocks Work ── */}
        <section>
          <SectionHeader icon={TrendingUp} label="Visual" title="How Stocks Work" color="text-emerald-400" />
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border p-6 mt-5 space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {[
                { step: '1', label: 'Buy', desc: 'You buy a stock at AED 100', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { step: '→', label: '', desc: '', color: '' },
                { step: '2', label: 'Hold', desc: 'You wait as the market moves', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                { step: '→', label: '', desc: '', color: '' },
                { step: '3', label: 'Sell', desc: 'Price rose to AED 120 → +AED 20 profit', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
              ].map((s, i) =>
                s.label ? (
                  <div key={i} className={`flex-1 rounded-xl border ${s.color} p-4`}>
                    <div className={`text-xs font-bold uppercase tracking-wide mb-1`}>{s.label}</div>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                ) : (
                  <span key={i} className="text-muted-foreground text-xl hidden sm:block">›</span>
                )
              )}
            </div>
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-4 py-3">
              <p className="text-xs text-emerald-300 font-medium">
                💡 Example: "If you buy a stock at AED 100 and it increases to AED 120, you gain AED 20 profit (20% return). But if it drops to AED 80, you lose AED 20."
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stock prices change based on company performance, global news, and investor sentiment. There is never a guarantee — this is why financial stability comes first.
            </p>
          </motion.div>
        </section>

        {/* ── 3. AI Investment Readiness ── */}
        <section>
          <SectionHeader icon={Brain} label="AI Analysis" title="Are You Ready to Invest?" color="text-purple-400" />
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-5 space-y-4">
            {readiness ? (
              <div className={`glass-card rounded-2xl border ${readiness.border} ${readiness.bg} p-6 flex flex-col sm:flex-row items-center gap-4`}>
                <ReadinessIcon className={`w-12 h-12 ${readiness.iconColor} flex-shrink-0`} />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-0.5">Your FINOVA Score: {score}/100</p>
                  <h3 className={`text-xl font-space font-bold ${readiness.color} mb-1`}>{readiness.label}</h3>
                  <p className="text-sm text-muted-foreground">{readiness.sublabel}</p>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl border border-border p-6 flex flex-col items-center gap-3 text-center">
                <Brain className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">No Financial Analysis Found</p>
                <p className="text-xs text-muted-foreground max-w-xs">Run the FINOVA AI analysis first to get your personalized investment readiness score.</p>
                <button onClick={() => navigate('/analyze')}
                  className="mt-1 gold-gradient text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  Run AI Analysis
                </button>
              </div>
            )}

            {/* Readiness scale */}
            <div className="glass-card rounded-2xl border border-border p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Investment Readiness Scale</p>
              <div className="space-y-2.5">
                {[
                  { range: '70–100', label: 'Ready to Invest', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
                  { range: '40–69', label: 'Improve Savings First', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: MinusCircle },
                  { range: '0–39', label: 'Not Recommended', color: 'text-rose-400', bg: 'bg-rose-500/10', icon: XCircle },
                ].map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 rounded-xl ${r.bg} px-4 py-2.5`}>
                      <Icon className={`w-4 h-4 ${r.color} flex-shrink-0`} />
                      <span className={`text-xs font-bold ${r.color} w-14`}>{r.range}</span>
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 4. Example Stocks ── */}
        <section>
          <SectionHeader icon={BarChart3} label="Examples" title="Stock Types (For Learning Only)" color="text-blue-400" />
          <div className="space-y-3 mt-5">
            {exampleStocks.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl border border-border overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/2 transition-colors"
                  onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.riskBg} ${s.riskColor} ${s.riskBorder}`}>{s.risk}</span>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:block">Return: {s.return}</span>
                    {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>
                {expanded === i && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    <p className="text-xs text-muted-foreground mt-2">Volatility: <span className={s.volatile ? 'text-rose-400' : 'text-emerald-400'}>{s.volatile ? 'High — prices can swing sharply' : 'Low — stable, predictable'}</span></p>
                  </div>
                )}
              </motion.div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-1">
              ⚠️ These are educational examples only. FINOVA AI is not a trading platform.
            </p>
          </div>
        </section>

        {/* ── 5. Warnings ── */}
        <section>
          <SectionHeader icon={AlertTriangle} label="Important" title="Smart Investing Warnings" color="text-rose-400" />
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 mt-5 space-y-3">
            {warnings.map((w, i) => {
              const Icon = w.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{w.text}</p>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* ── 6. Investment Simulator ── */}
        <section>
          <SectionHeader icon={Zap} label="Simulator" title="Simple Investment Simulator" color="text-gold" />
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border p-6 mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-2">Monthly Investment (AED)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">AED</span>
                  <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} min="0"
                    className="w-full bg-white/5 border border-border rounded-xl pl-12 pr-3 py-3 text-foreground font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-2">Number of Months</label>
                <input type="number" value={months} onChange={e => setMonths(e.target.value)} min="1" max="360"
                  className="w-full bg-white/5 border border-border rounded-xl px-3 py-3 text-foreground font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/5 border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                <p className="text-lg font-bold text-foreground font-space">AED {totalInvested.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Est. Growth (7%/yr)</p>
                <p className="text-lg font-bold text-emerald-400 font-space">+AED {Math.round(estimatedGrowth).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Projected Value</p>
                <p className="text-lg font-bold text-gold font-space">AED {Math.round(futureValue).toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              * Simulation uses 7% average annual return (index fund estimate). Not financial advice. Actual returns vary.
            </p>

            {/* Growth Chart */}
            <GrowthChart baseMonthly={parseFloat(monthly) || 200} totalMonths={parseInt(months) || 12} />
          </motion.div>
        </section>

        {/* ── 7. UAE Tips ── */}
        <section>
          <SectionHeader icon={Shield} label="UAE Tips" title="Smart Investing in the UAE" color="text-sky-400" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {uaeTips.map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-card rounded-2xl border border-border p-5 flex gap-3">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{tip.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FINOVA AI Connect ── */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <Cpu className="w-8 h-8 text-gold mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground mb-1 font-space">
            FINOVA AI recommends investing only when your financial stability score is high.
          </p>
          <p className="text-xs text-muted-foreground mb-4 max-w-md mx-auto">
            Build your savings, reduce your expense ratio, and eliminate risky spending before allocating any money to stocks or investments.
          </p>
          <button onClick={() => navigate('/analyze')}
            className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Check My FINOVA Score
          </button>
        </motion.div>

      </div>
    </div>
  );
}

// ─── Growth Chart Component ───────────────────────────────────────────────────
function GrowthChart({ baseMonthly, totalMonths }) {
  const monthlyRate = 0.07 / 12;

  const amounts = useMemo(() => {
    const half = Math.round(baseMonthly / 2);
    const double = Math.round(baseMonthly * 2);
    return [
      { amount: half, color: '#6366f1', label: `AED ${half}/mo` },
      { amount: baseMonthly, color: '#f5c441', label: `AED ${baseMonthly}/mo` },
      { amount: double, color: '#10b981', label: `AED ${double}/mo` },
    ].filter(a => a.amount > 0);
  }, [baseMonthly]);

  const data = useMemo(() => {
    const points = Math.min(totalMonths, 60);
    return Array.from({ length: points + 1 }, (_, i) => {
      const entry = { month: i === 0 ? 'Start' : `M${i}` };
      amounts.forEach(({ amount, label }) => {
        entry[label] = i === 0 ? 0 : Math.round(amount * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate));
      });
      return entry;
    });
  }, [amounts, totalMonths, monthlyRate]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-white/10 text-xs space-y-1">
        <p className="text-muted-foreground font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: AED {p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
        Hypothetical Growth Comparison
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
            interval={Math.max(1, Math.floor(data.length / 6) - 1)} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={v => <span className="text-xs text-muted-foreground">{v}</span>} iconType="circle" iconSize={7} />
          {amounts.map(({ label, color }) => (
            <Line key={label} type="monotone" dataKey={label} stroke={color} strokeWidth={2}
              dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Section Header Helper ─────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, title, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-border text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <h2 className="text-lg font-space font-bold text-foreground">{title}</h2>
    </div>
  );
}