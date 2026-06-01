import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowLeft, Brain, BarChart3, GitBranch, FlaskConical, Database, Calculator, CheckCircle2 } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';

const features = [
  { key: 'savings_rate', label: 'Savings Rate', formula: '(Income − Expenses) / Income × 100', weight: '35%', ideal: '≥ 20%', impact: 'Primary driver of long-term financial health', color: 'text-gold' },
  { key: 'expense_ratio', label: 'Expense Ratio', formula: 'Total Expenses / Monthly Income × 100', weight: '28%', ideal: '≤ 70%', impact: 'Measures how much of income is consumed by costs', color: 'text-blue-400' },
  { key: 'discretionary', label: 'Discretionary Spending', formula: 'Shopping / Monthly Income × 100', weight: '27%', ideal: '≤ 10%', impact: 'Proxy for lifestyle inflation and impulse spending', color: 'text-purple-400' },
  { key: 'emergency', label: 'Emergency Fund Bonus', formula: 'Savings / Monthly Expenses (capped at 3 months)', weight: '0–10 pts', ideal: '≥ 3 months', impact: 'Bonus score for maintaining a financial safety net', color: 'text-emerald-400' },
];

const scoringPipeline = [
  { step: '1', label: 'Data Input', desc: 'Collect income, expense categories, and current savings from user', icon: Database },
  { step: '2', label: 'Feature Engineering', desc: 'Calculate ratios: savings rate, expense ratio, shopping %, runway months', icon: FlaskConical },
  { step: '3', label: 'Weighted Scoring', desc: 'Apply weights (35/28/27/+10) and compute sub-scores per feature', icon: Calculator },
  { step: '4', label: 'Risk Classification', desc: 'Threshold-based: 0–39 = High Risk, 40–69 = Medium, 70–100 = Low', icon: GitBranch },
  { step: '5', label: 'AI Reasoning', desc: 'Generate factor-level explanations showing each component\'s contribution', icon: Brain },
  { step: '6', label: 'Recommendations', desc: 'Rule-based decision engine outputs ranked actions and scenario simulations', icon: CheckCircle2 },
];

const exampleData = {
  monthly_income: 5000,
  rent: 1800,
  food: 600,
  transport: 300,
  shopping: 800,
  other: 200,
  current_savings: 2000,
};

function computeExample() {
  const total = 1800 + 600 + 300 + 800 + 200;
  const surplus = 5000 - total;
  const savingsRate = (surplus / 5000) * 100;
  const expenseRatio = (total / 5000) * 100;
  const shoppingRatio = (800 / 5000) * 100;
  const savingsScore = Math.max(0, Math.min(100, (savingsRate / 20) * 100));
  const expenseScore = Math.max(0, Math.min(100, ((100 - expenseRatio) / 30) * 100));
  const riskyScore = Math.max(0, Math.min(100, ((20 - shoppingRatio) / 20) * 100));
  const runway = 2000 / total;
  const bonus = Math.min(10, (runway / 3) * 10);
  const final = Math.round(savingsScore * 0.35 + expenseScore * 0.28 + riskyScore * 0.27 + bonus);
  return { total, surplus, savingsRate, expenseRatio, shoppingRatio, savingsScore, expenseScore, riskyScore, runway, bonus, final };
}

const ex = computeExample();

export default function AIModel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="border-b border-border/50 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-lg text-foreground tracking-tight">FINOVA AI</span>
            <span className="text-xs text-muted-foreground hidden sm:block">/ AI Model & System</span>
          </div>
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8 md:space-y-12">

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Brain className="w-3 h-3" /> Technical Architecture
          </div>
          <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground mb-3">AI Model & System</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            A transparent view of FINOVA AI's scoring model, feature engineering pipeline, and decision logic.
          </p>
        </motion.div>

        {/* Model Overview */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Model Type', value: 'Weighted Rule-Based Model', desc: 'Deterministic scoring with explainable weights', icon: BarChart3, color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
              { label: 'Data Source', value: 'User-Simulated Input', desc: 'Student financial profiles, no external APIs', icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { label: 'Output', value: 'Score 0–100 + Risk Tier', desc: 'High / Medium / Low Risk with factor explanations', icon: GitBranch, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`glass-card rounded-2xl border ${c.border} ${c.bg} p-5`}>
                  <Icon className={`w-6 h-6 ${c.color} mb-3`} />
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{c.label}</p>
                  <p className={`text-sm font-bold font-space ${c.color} mb-1`}>{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Scoring Formula */}
        <section>
          <h2 className="text-lg font-space font-bold text-foreground mb-5 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gold" /> Scoring Formula
          </h2>
          <div className="glass-card rounded-2xl border border-border p-6">
            <div className="rounded-xl bg-secondary/40 border border-border px-5 py-4 font-mono text-sm text-foreground mb-5">
              <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wide">Final Score =</p>
              <p><span className="text-gold">SavingsScore</span> × 0.35</p>
              <p>+ <span className="text-blue-400">ExpenseScore</span> × 0.28</p>
              <p>+ <span className="text-purple-400">DiscretionaryScore</span> × 0.27</p>
              <p>+ <span className="text-emerald-400">EmergencyBonus</span> (0–10)</p>
              <p className="text-muted-foreground text-xs mt-3 border-t border-border pt-3">Clamped to [0, 100]</p>
            </div>

            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${f.color}`}>{f.label}</span>
                    <span className="text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-0.5 rounded">{f.weight}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground/80 mb-1 bg-secondary/20 px-2 py-1 rounded">{f.formula}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-muted-foreground">Ideal: <span className="text-emerald-400">{f.ideal}</span></span>
                    <span className="text-muted-foreground">{f.impact}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section>
          <h2 className="text-lg font-space font-bold text-foreground mb-5 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-400" /> AI Processing Pipeline
          </h2>
          <div className="space-y-3">
            {scoringPipeline.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-card rounded-xl border border-border p-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-foreground">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{s.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Live Example Calculation */}
        <section>
          <h2 className="text-lg font-space font-bold text-foreground mb-5 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" /> Example Calculation
          </h2>
          <div className="glass-card rounded-2xl border border-border p-6 space-y-5">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Sample Student Profile (AED)</p>
            
            {/* Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Income', value: `AED ${exampleData.monthly_income.toLocaleString()}` },
                { label: 'Rent', value: `AED ${exampleData.rent.toLocaleString()}` },
                { label: 'Shopping', value: `AED ${exampleData.shopping.toLocaleString()}` },
                { label: 'Savings', value: `AED ${exampleData.current_savings.toLocaleString()}` },
              ].map((d, i) => (
                <div key={i} className="rounded-xl bg-secondary/30 border border-border px-3 py-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">{d.label}</p>
                  <p className="text-sm font-bold text-foreground font-space">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Computed Features */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Computed Features:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {[
                  { label: 'Savings Rate', value: `${ex.savingsRate.toFixed(1)}%`, color: ex.savingsRate >= 20 ? 'text-emerald-400' : 'text-amber-400' },
                  { label: 'Expense Ratio', value: `${ex.expenseRatio.toFixed(1)}%`, color: ex.expenseRatio <= 70 ? 'text-emerald-400' : 'text-amber-400' },
                  { label: 'Shopping %', value: `${ex.shoppingRatio.toFixed(1)}%`, color: ex.shoppingRatio <= 10 ? 'text-emerald-400' : 'text-rose-400' },
                  { label: 'Runway', value: `${ex.runway.toFixed(1)} mo`, color: ex.runway >= 3 ? 'text-emerald-400' : 'text-amber-400' },
                ].map((f, i) => (
                  <div key={i} className="rounded-lg bg-secondary/20 px-3 py-2">
                    <p className="text-muted-foreground/70 text-xs mb-0.5">{f.label}</p>
                    <p className={`font-bold ${f.color}`}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Trace */}
            <div className="rounded-xl bg-secondary/30 border border-border px-4 py-4 font-mono text-xs space-y-1.5">
              <p className="text-muted-foreground">Score calculation trace:</p>
              <p><span className="text-gold">{ex.savingsScore.toFixed(0)}</span> × 0.35 = <span className="text-gold">{(ex.savingsScore * 0.35).toFixed(1)}</span> pts  <span className="text-muted-foreground">(savings rate)</span></p>
              <p><span className="text-blue-400">{ex.expenseScore.toFixed(0)}</span> × 0.28 = <span className="text-blue-400">{(ex.expenseScore * 0.28).toFixed(1)}</span> pts  <span className="text-muted-foreground">(expense ratio)</span></p>
              <p><span className="text-purple-400">{ex.riskyScore.toFixed(0)}</span> × 0.27 = <span className="text-purple-400">{(ex.riskyScore * 0.27).toFixed(1)}</span> pts  <span className="text-muted-foreground">(discretionary)</span></p>
              <p>+ <span className="text-emerald-400">{ex.bonus.toFixed(1)}</span> pts  <span className="text-muted-foreground">(emergency bonus)</span></p>
              <p className="border-t border-border pt-2 text-foreground font-bold">= <span className="text-gold text-base">{ex.final}</span> / 100  →  <span className={ex.final >= 70 ? 'text-emerald-400' : ex.final >= 40 ? 'text-amber-400' : 'text-rose-400'}>{ex.final >= 70 ? 'Low Risk' : ex.final >= 40 ? 'Medium Risk' : 'High Risk'}</span></p>
            </div>
          </div>
        </section>

        {/* Design Notes */}
        <section>
          <h2 className="text-lg font-space font-bold text-foreground mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-sky-400" /> Design Decisions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Why weighted model?', text: 'A transparent, explainable model is more appropriate for a student-facing tool than a black-box ML model. Every score decision can be traced back to a specific financial metric.' },
              { title: 'Why no ML?', text: 'Insufficient labeled training data for UAE student finances. A rule-based system grounded in financial best-practices (50/30/20 rule, 3-month emergency fund) is more reliable and auditable.' },
              { title: 'Why AED?', text: 'The UAE dirham is the functional currency for all target users. All thresholds are calibrated to UAE student cost-of-living benchmarks (rent, transport, food).' },
              { title: 'Future improvements', text: 'Bayesian updating from behavioral data, NLP for BNPL detection, time-series modeling using 6-month expense history, and integration with UAE Open Banking APIs.' },
            ].map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-card rounded-2xl border border-border p-5">
                <p className="text-sm font-semibold text-foreground mb-2">{n.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
      <MobileNav />
    </div>
  );
}