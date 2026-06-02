import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, Loader2 } from 'lucide-react';
import { calculateFinancialScore, classifyRisk, getRiskColor, generateAIExplanations } from '../../lib/financialEngine';

const EXPENSE_FIELDS = [
  { key: 'rent', label: 'Rent / Housing', placeholder: '2000' },
  { key: 'food', label: 'Food & Dining', placeholder: '800' },
  { key: 'transport', label: 'Transport', placeholder: '400' },
  { key: 'shopping', label: 'Shopping', placeholder: '500' },
  { key: 'other', label: 'Other', placeholder: '300' },
];

export default function TryDemoForm({ onResult }) {
  const [form, setForm] = useState({ monthly_income: '', rent: '', food: '', transport: '', shopping: '', other: '', current_savings: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Short artificial delay for effect
    await new Promise(r => setTimeout(r, 1200));
    const numericData = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, parseFloat(v) || 0]));
    const metrics = calculateFinancialScore(numericData);
    const riskLevel = classifyRisk(metrics.score);
    const riskColor = getRiskColor(riskLevel);
    const insights = generateAIExplanations(numericData, metrics);
    setLoading(false);
    onResult({ data: numericData, metrics, riskLevel, riskColor, insights });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 gold-gradient rounded-lg flex items-center justify-center">
          <Cpu className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-space font-bold text-base text-foreground">Try FINOVA AI — Free</span>
      </div>
      <p className="text-xs text-muted-foreground mb-5">No account needed. Enter your numbers and see your score instantly.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Income */}
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Monthly Income (AED) <span className="text-primary">*</span></label>
          <input
            type="number" required min="1" placeholder="e.g. 5000"
            value={form.monthly_income} onChange={e => set('monthly_income', e.target.value)}
            className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Expenses grid */}
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Monthly Expenses (AED)</label>
          <div className="grid grid-cols-2 gap-2">
            {EXPENSE_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <p className="text-xs text-muted-foreground/70 mb-1">{label}</p>
                <input
                  type="number" min="0" placeholder={placeholder}
                  value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 transition-all"
                />
              </div>
            ))}
            <div>
              <p className="text-xs text-muted-foreground/70 mb-1">Current Savings</p>
              <input
                type="number" min="0" placeholder="0"
                value={form.current_savings} onChange={e => set('current_savings', e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/40 transition-all"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={!form.monthly_income || loading}
          className="w-full gold-gradient text-primary-foreground py-3 rounded-xl font-space font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your finances…</>
          ) : (
            <><Cpu className="w-4 h-4" /> Get My Financial Score <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </motion.div>
  );
}