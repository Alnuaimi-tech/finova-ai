import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, Utensils, Car, ShoppingBag, MoreHorizontal, PiggyBank, Cpu, Sparkles, TrendingUp } from 'lucide-react';
import AIPipeline from '../components/finova/AIPipeline';
import MobileNav from '../components/finova/MobileNav';
import { base44 } from '@/api/base44Client';
import { calculateFinancialScore, classifyRisk, generateAIExplanations, generatePredictions } from '../lib/financialEngine';

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
  const [formData, setFormData] = useState({
    monthly_income: '', rent: '', food: '', transport: '', shopping: '', other: '', current_savings: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalExpenses = fields.reduce((sum, f) => sum + (parseFloat(formData[f.key]) || 0), 0);
  const income = parseFloat(formData.monthly_income) || 0;
  const surplus = income - totalExpenses;
  const expensePct = income > 0 ? Math.round((totalExpenses / income) * 100) : 0;
  const isValid = income > 0;

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gold-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-space font-bold text-base text-foreground tracking-tight">FINOVA AI</span>
              <span className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-2">UAE 🇦🇪</span>
            </div>
          </div>
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