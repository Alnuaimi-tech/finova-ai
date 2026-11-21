import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Shield, CreditCard, Lightbulb,
  GraduationCap, BarChart3, AlertTriangle, CheckCircle2, XCircle, MinusCircle,
  ChevronDown, Zap, Target, Home, Car, Phone, Calculator, BookOpen
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MobileNav from '../components/finova/MobileNav';
import BrandLogo from '../components/finova/BrandLogo';
import { useLanguage } from '@/lib/LanguageContext';
import { calculateFinancialScore } from '@/lib/financialEngine';
import SkipLink from '@/components/finova/SkipLink';

// Icons, colours and the English/English-neutral structure only — all copy comes from t.learnPage.
const modules = [
  { icon: DollarSign, color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { icon: Car, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  { icon: Phone, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
];

const TABS = [
  { id: 'lessons', icon: BookOpen },
  { id: 'stocks', icon: BarChart3 },
  { id: 'simulator', icon: Calculator },
];

export default function Learn() {
  const navigate = useNavigate();
  const { lang, toggle, t } = useLanguage();
  const L = t.learnPage;
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
    // Use the same engine as the Dashboard so the score is identical everywhere.
    const d = Object.fromEntries(Object.entries(JSON.parse(raw)).map(([k, v]) => [k, parseFloat(v) || 0]));
    score = calculateFinancialScore(d).score;
  }

  const readiness = score === null ? null : score >= 70
    ? { label: L.ready.ready, sub: L.readySub.ready, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', Icon: CheckCircle2 }
    : score >= 40
      ? { label: L.ready.build, sub: L.readySub.build, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', Icon: MinusCircle }
      : { label: L.ready.not, sub: L.readySub.not, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', Icon: XCircle };

  const chartData = useMemo(() => {
    const points = Math.min(n, 60);
    return Array.from({ length: points + 1 }, (_, i) => ({
      month: i === 0 ? t.dash.nowLabel : `M${i}`,
      value: i === 0 ? 0 : Math.round(m * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate)),
      invested: m * i,
    }));
  }, [m, n, monthlyRate, t.dash.nowLabel]);

  const stockTypes = L.types.map((s, i) => ({
    ...s,
    exchange: 'ADX / DFM',
    risk: i === 0 ? t.dash.risk['Low Risk'] : i === 1 ? t.dash.risk['Medium Risk'] : t.dash.risk['High Risk'],
    riskColor: i === 0 ? 'text-emerald-400' : i === 1 ? 'text-amber-400' : 'text-rose-400',
    riskBg: i === 0 ? 'bg-emerald-500/10' : i === 1 ? 'bg-amber-500/10' : 'bg-rose-500/10',
  }));

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SkipLink />
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="font-space font-bold text-base text-foreground tracking-tight">{t.learn}</span>
            <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5 hidden sm:inline">{t.learnBadge}</span>
          </div>
          <button onClick={toggle}
            className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 transition-all font-medium">
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </header>

      <main id="main-content" className="max-w-3xl mx-auto px-4 md:px-6 py-5">
        {/* Welcome banner */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{L.bannerTitle}</p>
            <p className="text-xs text-muted-foreground">{L.bannerSub(modules.length)}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl border border-border mb-6">
          {TABS.map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} role="tab" aria-selected={activeTab === id} aria-label={L.tabs[id]}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}>
              <Icon className="w-4 h-4" />
              {L.tabs[id]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'lessons' && (
            <motion.div key="lessons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-3">
              <p className="eyebrow">{L.lessonsAvailable(modules.length)}</p>
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const open = expanded === i;
                const content = L.content[i];
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`glass-card rounded-2xl border ${open ? 'border-white/10' : 'border-border'} overflow-hidden`}>
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/2 transition-colors text-start"
                      onClick={() => setExpanded(open ? null : i)}>
                      <div className={`w-10 h-10 rounded-xl ${mod.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${mod.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mod.bg} ${mod.color} border ${mod.border}`}>{content.tag}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{t.learnModules[i]}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">{content.desc}</p>
                        <ul className="space-y-2">
                          {content.points.map((pt, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${mod.color.replace('text-', 'bg-')}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                        {content.tip && (
                          <div className={`rounded-xl ${mod.bg} border ${mod.border} px-4 py-3 text-xs ${mod.color} font-medium`}>
                            {content.tip}
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
                <p className="text-sm font-semibold text-foreground mb-1">{L.ctaTitle}</p>
                <p className="text-xs text-muted-foreground mb-4">{L.ctaDesc}</p>
                <button onClick={() => navigate('/analyze')}
                  className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                  {L.ctaBtn}
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
                    <p className="text-xs text-muted-foreground mb-0.5">{L.yourScore(score)}</p>
                    <p className={`text-lg font-space font-bold ${readiness.color}`}>{readiness.label}</p>
                    <p className="text-sm text-muted-foreground">{readiness.sub}</p>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-2xl border border-border p-5 text-center">
                  <p className="text-sm text-muted-foreground mb-3">{L.runToCheck}</p>
                  <button onClick={() => navigate('/analyze')} className="gold-gradient text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium">
                    {L.runAnalysis}
                  </button>
                </div>
              )}

              <div className="glass-card rounded-2xl border border-border p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground font-space">{L.investingTitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {L.inv1}<strong className="text-foreground">{L.adx}</strong>{L.inv2}<strong className="text-foreground">{L.dfm}</strong>{L.inv3}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-xs text-center">
                  {[
                    { label: L.exBuy, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                    { label: L.exRise, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                    { label: L.exProfit, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  ].map((s, i) => (
                    <div key={i} className={`flex-1 rounded-xl px-3 py-2 font-medium border ${s.color}`}>{s.label}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">{L.typesTitle}</p>
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
                <p className="text-sm font-semibold text-rose-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {L.warningsTitle}</p>
                {L.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    {w}
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/market')}
                className="w-full gold-gradient text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <BarChart3 className="w-4 h-4" />
                {L.explore}
              </button>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div key="simulator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <div className="glass-card rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2.5 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground font-space">{L.simTitle}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-5">{L.simDesc}</p>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-2">{L.simMonthly}</label>
                    <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} min="0"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-sm focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium block mb-2">{L.simMonths}</label>
                    <input type="number" value={months} onChange={e => setMonths(e.target.value)} min="1" max="360"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground font-semibold text-sm focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: L.simInvest, value: `AED ${totalInvested.toLocaleString('en-US')}`, color: 'text-foreground', bg: 'bg-secondary/30', border: 'border-border' },
                    { label: L.simGrowth, value: `+AED ${Math.round(estimatedGrowth).toLocaleString('en-US')}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: L.simTotal, value: `AED ${Math.round(futureValue).toLocaleString('en-US')}`, color: 'text-gold', bg: 'bg-primary/10', border: 'border-primary/20' },
                  ].map((s, i) => (
                    <div key={i} className={`rounded-xl ${s.bg} border ${s.border} p-3 text-center`}>
                      <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                      <p className={`text-sm font-bold font-space ${s.color}`} dir="ltr">{s.value}</p>
                    </div>
                  ))}
                </div>

                {chartData.length > 1 && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
                        interval={Math.max(1, Math.floor(chartData.length / 5) - 1)} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
                        tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={32} />
                      <Tooltip formatter={(v, name) => [`AED ${v?.toLocaleString('en-US')}`, name === 'value' ? L.portfolioValue : L.amountInvested]}
                        contentStyle={{ background: 'hsl(222,40%,9%)', border: '1px solid hsl(222,30%,16%)', borderRadius: '12px', fontSize: 12 }}
                        labelStyle={{ color: '#94a3b8' }} />
                      <Line type="monotone" dataKey="invested" stroke="#475569" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                      <Line type="monotone" dataKey="value" stroke="hsl(43,96%,56%)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                <p className="text-xs text-muted-foreground text-center mt-3">{L.simNote}</p>
              </div>

              {/* Quick presets */}
              <div className="glass-card rounded-2xl border border-border p-4">
                <p className="eyebrow mb-3">{L.presetsTitle}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { ...L.presets[0], monthly: '150', months: '24' },
                    { ...L.presets[1], monthly: '300', months: '36' },
                    { ...L.presets[2], monthly: '800', months: '60' },
                    { ...L.presets[3], monthly: '1000', months: '120' },
                  ].map((p, i) => (
                    <button key={i} onClick={() => { setMonthly(p.monthly); setMonths(p.months); }}
                      className="glass-card rounded-xl border border-border p-3 text-start hover:border-white/10 transition-all">
                      <p className="text-xs font-semibold text-foreground">{p.label}</p>
                      <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                      <p className="text-xs text-primary font-medium mt-1">{L.perMo(p.monthly, p.months)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <MobileNav />
    </div>
  );
}