import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, DollarSign, Home, Utensils, Car, ShoppingBag, MoreHorizontal, PiggyBank, Cpu, Sparkles } from 'lucide-react';
import AIPipeline from '../components/finova/AIPipeline';
import MobileNav from '../components/finova/MobileNav';

const fields = [
  { key: 'rent', label: 'Rent', icon: Home, placeholder: '3,500', color: 'text-indigo-400', desc: 'Monthly rent / accommodation' },
  { key: 'food', label: 'Food & Dining', icon: Utensils, placeholder: '800', color: 'text-amber-400', desc: 'Groceries + meals out' },
  { key: 'transport', label: 'Transport', icon: Car, placeholder: '400', color: 'text-emerald-400', desc: 'Metro, taxi, fuel' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, placeholder: '600', color: 'text-rose-400', desc: 'Clothes, electronics, etc.' },
  { key: 'other', label: 'Other', icon: MoreHorizontal, placeholder: '300', color: 'text-purple-400', desc: 'Entertainment, subscriptions' },
];

export default function InputForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthly_income: '',
    rent: '',
    food: '',
    transport: '',
    shopping: '',
    other: '',
    current_savings: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalExpenses = fields.reduce((sum, f) => sum + (parseFloat(formData[f.key]) || 0), 0);
  const income = parseFloat(formData.monthly_income) || 0;
  const surplus = income - totalExpenses;
  const expensePct = income > 0 ? Math.round((totalExpenses / income) * 100) : 0;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.monthly_income) return;
    setIsAnalyzing(true);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1800));
    // Store in sessionStorage for dashboard
    sessionStorage.setItem('finova_data', JSON.stringify(formData));
    navigate('/dashboard');
  };

  const isValid = parseFloat(formData.monthly_income) > 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-base md:text-lg text-foreground tracking-tight">FINOVA AI</span>
          </div>
          <span className="text-xs text-muted-foreground px-2 md:px-3 py-1 rounded-full border border-border hidden sm:block">
            UAE Student Finance System
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* AI Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="glass-card rounded-2xl border border-border p-3 md:p-4 mb-6 md:mb-8 overflow-x-auto">
            <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-widest font-medium">AI Analysis Pipeline</p>
            <AIPipeline activeStep={0} />
          </div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                AI-Powered Financial Analysis
              </div>
              <h1 className="text-2xl md:text-4xl font-space font-bold text-foreground mb-2">
                Enter Your Financial Data
              </h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Our AI model will analyze your financial behavior and generate a personalized stability report.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Income Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl border border-border p-6 mb-6"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Monthly Income</p>
              <p className="text-xs text-muted-foreground">Salary, allowance, or any regular income</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">AED</span>
            <input
              type="number"
              value={formData.monthly_income}
              onChange={e => handleChange('monthly_income', e.target.value)}
              placeholder="5,000"
              className="w-full bg-white/5 border border-border rounded-xl pl-14 pr-4 py-3.5 text-foreground font-semibold text-lg placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Expense Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl border border-border p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Monthly Expenses</p>
              <p className="text-xs text-muted-foreground">Break down your spending by category</p>
            </div>
            {income > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className={`text-sm font-bold ${expensePct > 90 ? 'text-rose-400' : expensePct > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  AED {totalExpenses.toLocaleString()} ({expensePct}%)
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, i) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <label className="flex items-center gap-2 mb-2">
                    <Icon className={`w-3.5 h-3.5 ${field.color}`} />
                    <span className="text-sm text-foreground font-medium">{field.label}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{field.desc}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">AED</span>
                    <input
                      type="number"
                      value={formData[field.key]}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-border rounded-xl pl-12 pr-3 py-3 text-foreground font-medium placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl border border-border p-6 mb-8"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Current Savings</p>
              <p className="text-xs text-muted-foreground">Total savings or emergency fund balance</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">AED</span>
            <input
              type="number"
              value={formData.current_savings}
              onChange={e => handleChange('current_savings', e.target.value)}
              placeholder="10,000"
              className="w-full bg-white/5 border border-border rounded-xl pl-14 pr-4 py-3.5 text-foreground font-semibold text-lg placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Live Preview */}
        {income > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-border p-4 mb-6"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Live Preview</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="text-sm font-bold text-gold">AED {income.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className={`text-sm font-bold ${expensePct > 80 ? 'text-rose-400' : 'text-foreground'}`}>
                  AED {totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Surplus</p>
                <p className={`text-sm font-bold ${surplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {surplus >= 0 ? '+' : ''}AED {surplus.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analyze Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleAnalyze}
          disabled={!isValid || isAnalyzing}
          className={`w-full py-4 rounded-2xl font-space font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
            isValid && !isAnalyzing
              ? 'gold-gradient text-primary-foreground shadow-lg hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-white/5 text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>AI is analyzing your data...</span>
            </>
          ) : (
            <>
              <Cpu className="w-5 h-5" />
              <span>Run AI Financial Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          🔒 Your data is processed locally and never shared
        </p>
      </div>
      <MobileNav />
    </div>
  );
}