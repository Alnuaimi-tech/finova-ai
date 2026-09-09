import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, Utensils, Car, ShoppingBag, MoreHorizontal, PiggyBank, Cpu, Sparkles, TrendingUp, Briefcase } from 'lucide-react';
import AIPipeline from '../components/finova/AIPipeline';
import MobileNav from '../components/finova/MobileNav';
import BrandLogo from '../components/finova/BrandLogo';
import { base44 } from '@/api/base44Client';
import { calculateFinancialScore, classifyRisk, generateAIExplanations, generatePredictions } from '../lib/financialEngine';

const PROFESSIONS = [
  'Student / Part-time',
  'Retail & Hospitality',
  'Administrative / Office',
  'Teacher',
  'Engineer',
  'IT / Software',
  'Healthcare',
  'Government',
  'Finance / Banking',
  'Freelancer / Self-employed',
  'Other',
];

// Typical gross monthly salary ranges in the UAE (AED), per profession — reference only.
const PROFESSION_INCOME_RANGES = {
  'Student / Part-time': '1,500 – 4,000',
  'Retail & Hospitality': '3,000 – 7,000',
  'Administrative / Office': '5,000 – 9,000',
  'Teacher': '8,000 – 16,000',
  'Engineer': '10,000 – 25,000',
  'IT / Software': '12,000 – 30,000',
  'Healthcare': '8,000 – 28,000',
  'Government': '10,000 – 30,000',
  'Finance / Banking': '12,000 – 35,000',
  'Freelancer / Self-employed': '5,000 – 20,000',
  'Other': '—',
};

// Realistic UAE-based default estimates per profession (AED/month).
// Income = typical midpoint; expenses scaled to local cost of living; savings ≈ 2× monthly income.
const PROFESSION_DEFAULTS = {
  'Student / Part-time': { monthly_income: 2750, rent: 1200, food: 600, transport: 300, shopping: 400, other: 250, current_savings: 3000 },
  'Retail & Hospitality': { monthly_income: 5000, rent: 2000, food: 800, transport: 400, shopping: 600, other: 400, current_savings: 8000 },
  'Administrative / Office': { monthly_income: 7000, rent: 2800, food: 900, transport: 500, shopping: 700, other: 500, current_savings: 14000 },
  'Teacher': { monthly_income: 12000, rent: 4500, food: 1200, transport: 700, shopping: 900, other: 600, current_savings: 24000 },
  'Engineer': { monthly_income: 17500, rent: 6000, food: 1500, transport: 900, shopping: 1200, other: 800, current_savings: 35000 },
  'IT / Software': { monthly_income: 21000, rent: 7000, food: 1600, transport: 1000, shopping: 1400, other: 900, current_savings: 45000 },
  'Healthcare': { monthly_income: 18000, rent: 6000, food: 1400, transport: 900, shopping: 1100, other: 700, current_savings: 36000 },
  'Government': { monthly_income: 20000, rent: 6500, food: 1500, transport: 950, shopping: 1200, other: 800, current_savings: 40000 },
  'Finance / Banking': { monthly_income: 23500, rent: 7500, food: 1700, transport: 1100, shopping: 1500, other: 1000, current_savings: 50000 },
  'Freelancer / Self-employed': { monthly_income: 12500, rent: 4500, food: 1200, transport: 700, shopping: 900, other: 600, current_savings: 25000 },
  'Other': { monthly_income: 10000, rent: 4000, food: 1200, transport: 800, shopping: 1000, other: 700, current_savings: 20000 },
};

const fields = [
  { key: 'rent', label: 'Rent / Housing', icon: Home, placeholder: '3,500', color: 'text-indigo-400', bg: 'bg-indigo-500/10', desc: 'Monthly rent or accommodation' },
  { key: 'food', label: 'Food & Dining', icon: Utensils, placeholder: '800', color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Groceries + meals out' },
  { key: 'transport', label: 'Transport', icon: Car, placeholder: '400', color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Metro, taxi, fuel, Salik' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, placeholder: '600', color: 'text-rose-400', bg: 'bg-rose-500/10', desc: 'Clothes, electronics, etc.' },
  { key: 'other', label: 'Other', icon: MoreHorizontal, placeholder: '300', color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Entertainment, subscriptions' },
];

function AEDInput({ value, onChange, placeholder, large = false }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
        <span className="text-xs font-bold text-muted-foreground tracking-wider">AED</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-secondary/40 border border-border hover:border-border/80 rounded-2xl pl-14 pr-4 text-foreground font-semibold placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${large ? 'py-5 text-xl' : 'py-4 text-base'}`}
      />
    </div>
  );
}

export default function InputForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const d = PROFESSION_DEFAULTS['Student / Part-time'];
    return {
      profession: 'Student / Part-time',
      monthly_income: String(d.monthly_income),
      rent: String(d.rent), food: String(d.food), transport: String(d.transport),
      shopping: String(d.shopping), other: String(d.other), current_savings: String(d.current_savings),
    };
  });
  const [dirty, setDirty] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fill non-dirty fields with profession-based estimates so the form stays completable after switching profession.
  const applyDefaults = (profession, current, currentDirty) => {
    const d = PROFESSION_DEFAULTS[profession] || PROFESSION_DEFAULTS['Other'];
    const next = { ...current };
    ['monthly_income', 'rent', 'food', 'transport', 'shopping', 'other', 'current_savings'].forEach(k => {
      if (!currentDirty[k]) next[k] = String(d[k]);
    });
    return next;
  };

  const incomeRange = PROFESSION_INCOME_RANGES[formData.profession] || '—';
  const userTypedIncome = formData.monthly_income !== '';

  const totalExpenses = fields.reduce((sum, f) => sum + (parseFloat(formData[f.key]) || 0), 0);
  const income = parseFloat(formData.monthly_income) || 0;
  const surplus = income - totalExpenses;
  const expensePct = income > 0 ? Math.round((totalExpenses / income) * 100) : 0;
  const isValid = income > 0;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setDirty(prev => ({ ...prev, [key]: true }));
  };

  const handleProfessionChange = (value) => {
    setDirty(prev => ({ ...prev, profession: true }));
    setFormData(prev => applyDefaults(value, { ...prev, profession: value }, dirty));
  };

  const handleAnalyze = async () => {
    if (!isValid) return;
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));
    const numericData = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v) || 0]));
    const m = calculateFinancialScore(numericData);
    const riskLevel = classifyRisk(m.score);
    const insightList = generateAIExplanations(numericData, m);
    const predictionData = generatePredictions(numericData, m);
    const aiAnalysisText = insightList.map(i => `${i.title}: ${i.text}`).join('\n\n');
    const predictionSummaryText = predictionData.narrative;
    try {
      await base44.entities.FinancialProfile.create({
        profession: formData.profession,
        monthly_income: numericData.monthly_income,
        rent: numericData.rent,
        food: numericData.food,
        transport: numericData.transport,
        shopping: numericData.shopping,
        other: numericData.other,
        current_savings: numericData.current_savings,
        stability_score: m.score,
        risk_level: riskLevel,
        ai_analysis: aiAnalysisText,
        prediction_summary: predictionSummaryText,
      });
    } catch (e) {
      // persistence failure should not block the dashboard experience
    }
    sessionStorage.setItem('finova_data', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-4 sticky top-0 z-20 bg-background/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <BrandLogo size="lg" showWordmark showBadge />
          <span className="text-xs text-muted-foreground bg-secondary/50 border border-border px-3 py-1.5 rounded-full font-medium">
            Step 1 of 1
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Pipeline */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="glass-card rounded-2xl border border-border p-4 overflow-x-auto">
            <p className="text-[10px] text-muted-foreground text-center mb-3 uppercase tracking-widest font-semibold">AI Analysis Pipeline</p>
            <AIPipeline activeStep={0} />
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            AI-Powered Financial Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground mb-2 tracking-tight">Your Financial Profile</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Enter your monthly numbers — our AI will generate a personalized stability score in seconds.
          </p>
        </motion.div>

        {/* Profession Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 md:p-8 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground font-space">Your Profession</p>
              <p className="text-xs text-muted-foreground">Helps us suggest a realistic UAE income range</p>
            </div>
          </div>
          <div className="relative">
            <select
              value={formData.profession}
              onChange={e => handleProfessionChange(e.target.value)}
              className="w-full bg-secondary/40 border border-border hover:border-border/80 rounded-2xl px-4 py-4 text-base font-semibold text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
            >
              {PROFESSIONS.map(p => (
                <option key={p} value={p} className="bg-card text-foreground">{p}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>

        {/* Income Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6 md:p-8 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-yellow-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground font-space">Monthly Income</p>
              <p className="text-xs text-muted-foreground">Salary, allowance, or any regular income</p>
            </div>
          </div>
          <AEDInput value={formData.monthly_income} onChange={v => handleChange('monthly_income', v)} placeholder="5,000" large />
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 px-3.5 py-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Typical {formData.profession} income in UAE:</span>{' '}
              <span className="text-blue-400 font-semibold">AED {incomeRange}</span>/month
              {userTypedIncome && (
                <span className="text-muted-foreground"> — just a reference, enter your actual income above.</span>
              )}
              {!userTypedIncome && incomeRange !== '—' && (
                <span className="text-muted-foreground"> — not sure? Use this as a starting estimate.</span>
              )}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Required to calculate your FINOVA score
          </p>
        </motion.div>

        {/* Expenses Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card rounded-3xl border border-border p-6 md:p-8 mb-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-bold text-foreground font-space">Monthly Expenses</p>
              <p className="text-xs text-muted-foreground mt-0.5">Break down your spending by category</p>
            </div>
            {income > 0 && (
              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${expensePct > 90 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : expensePct > 70 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                {expensePct}% of income
              </div>
            )}
          </div>
          <div className="space-y-4">
            {fields.map((field, i) => {
              const Icon = field.icon;
              return (
                <motion.div key={field.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-7 h-7 rounded-lg ${field.bg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${field.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{field.label}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{field.desc}</span>
                  </div>
                  <AEDInput value={formData[field.key]} onChange={v => handleChange(field.key, v)} placeholder={field.placeholder} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Savings Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground font-space">Current Savings</p>
              <p className="text-xs text-muted-foreground">Total savings or emergency fund balance</p>
            </div>
          </div>
          <AEDInput value={formData.current_savings} onChange={v => handleChange('current_savings', v)} placeholder="10,000" large />
          <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Used to assess your financial safety net
          </p>
        </motion.div>

        {/* Live Summary */}
        {income > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-border p-5 mb-6">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Live Summary</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Income', value: `AED ${income.toLocaleString()}`, color: 'text-gold' },
                { label: 'Expenses', value: `AED ${totalExpenses.toLocaleString()}`, color: expensePct > 80 ? 'text-rose-400' : 'text-foreground' },
                { label: 'Surplus', value: `${surplus >= 0 ? '+' : ''}AED ${surplus.toLocaleString()}`, color: surplus >= 0 ? 'text-emerald-400' : 'text-rose-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-sm font-bold font-space ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            {income > 0 && (
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${expensePct > 90 ? 'bg-rose-400' : expensePct > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(expensePct, 100)}%` }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={handleAnalyze}
          disabled={!isValid || isAnalyzing}
          whileHover={isValid && !isAnalyzing ? { scale: 1.01 } : {}}
          whileTap={isValid && !isAnalyzing ? { scale: 0.99 } : {}}
          className={`w-full py-5 rounded-2xl font-space font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
            isValid && !isAnalyzing
              ? 'gold-gradient text-primary-foreground shadow-xl'
              : 'bg-secondary/50 text-muted-foreground cursor-not-allowed border border-border'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              AI is analyzing your data…
            </>
          ) : (
            <>
              <Cpu className="w-5 h-5" />
              Run AI Financial Analysis
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          <span>🔒</span> Your data is processed locally and never shared
        </p>
      </div>
      <MobileNav />
    </div>
  );
}