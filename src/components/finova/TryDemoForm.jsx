import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, Loader2, TrendingUp, Home, Utensils, Car, ShoppingBag, MoreHorizontal, PiggyBank } from 'lucide-react';
import { calculateFinancialScore, classifyRisk, getRiskColor, generateAIExplanations } from '../../lib/financialEngine';
import { useLanguage } from '@/lib/LanguageContext';

const EXPENSE_FIELDS = [
  { key: 'rent', icon: Home, placeholder: '2000', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { key: 'food', icon: Utensils, placeholder: '800', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'transport', icon: Car, placeholder: '400', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'shopping', icon: ShoppingBag, placeholder: '500', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { key: 'other', icon: MoreHorizontal, placeholder: '300', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

function FieldInput({ value, onChange, placeholder, label, icon: Icon, color, bg, large }) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          {Icon && (
            <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-3 h-3 ${color}`} />
            </div>
          )}
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </div>
      )}
      <div className="relative">
        <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground tracking-wider pointer-events-none">AED</span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-secondary/50 border border-border hover:border-border/80 rounded-xl ps-12 pe-3 text-foreground font-semibold placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${large ? 'py-4 text-lg' : 'py-3 text-sm'}`}
        />
      </div>
    </div>
  );
}

export default function TryDemoForm({ onResult }) {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState({ monthly_income: '', rent: '', food: '', transport: '', shopping: '', other: '', current_savings: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const numericData = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v) || 0]));
    const metrics = calculateFinancialScore(numericData);
    const riskLevel = classifyRisk(metrics.score);
    const riskColor = getRiskColor(riskLevel);
    const insights = generateAIExplanations(numericData, metrics, lang);
    setLoading(false);
    onResult({ data: numericData, metrics, riskLevel, riskColor, insights });
  };

  return (
    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-4">

      {/* Income Card */}
      <div className="glass-card rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-yellow-500/15 flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-gold" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground font-space">{t.monthlyIncome}</p>
            <p className="text-xs text-muted-foreground">{t.incomeDesc}</p>
          </div>
          <span className="ms-auto text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">{t.demo.required}</span>
        </div>
        <FieldInput value={form.monthly_income} onChange={v => set('monthly_income', v)} placeholder="5,000" large />
      </div>

      {/* Expenses Card */}
      <div className="glass-card rounded-3xl border border-border p-6">
        <p className="text-sm font-bold text-foreground font-space mb-1">{t.monthlyExpenses}</p>
        <p className="text-xs text-muted-foreground mb-5">{t.demo.expensesHint}</p>
        <div className="grid grid-cols-2 gap-4">
          {EXPENSE_FIELDS.map(({ key, icon, placeholder, color, bg }) => (
            <FieldInput key={key} value={form[key]} onChange={v => set(key, v)} placeholder={placeholder}
              label={t.inp.fields[key][0]} icon={icon} color={color} bg={bg} />
          ))}
          <FieldInput value={form.current_savings} onChange={v => set('current_savings', v)} placeholder="0"
            label={t.demo.savings} icon={PiggyBank} color="text-emerald-400" bg="bg-emerald-500/10" />
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={!form.monthly_income || loading}
        className="w-full gold-gradient text-primary-foreground py-4 rounded-2xl font-space font-bold text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 hover:opacity-90 transition-opacity shadow-xl">
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {t.demo.analyzing}</>
        ) : (
          <><Cpu className="w-4 h-4" /> {t.demo.getScore} <ArrowRight className="w-4 h-4 rtl:rotate-180" /></>
        )}
      </button>
      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        {t.demo.localNote}
      </p>
    </motion.form>
  );
}