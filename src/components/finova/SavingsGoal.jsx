import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Pencil, CheckCircle2, X } from 'lucide-react';

const STORAGE_KEY = 'finova_savings_goal';

export default function SavingsGoal({ currentSavings }) {
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseFloat(saved) : null;
  });
  const [editing, setEditing] = useState(() => !localStorage.getItem(STORAGE_KEY));
  const [inputVal, setInputVal] = useState(() => localStorage.getItem(STORAGE_KEY) || '');

  const current = currentSavings || 0;
  const progress = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  const remaining = goal ? Math.max(0, goal - current) : 0;

  const barColor =
    progress >= 100 ? 'bg-emerald-400' :
    progress >= 60  ? 'bg-gold' :
    progress >= 30  ? 'bg-amber-400' : 'bg-rose-400';

  const textColor =
    progress >= 100 ? 'text-emerald-400' :
    progress >= 60  ? 'text-gold' :
    progress >= 30  ? 'text-amber-400' : 'text-rose-400';

  function handleSave() {
    const val = parseFloat(inputVal);
    if (!val || val <= 0) return;
    setGoal(val);
    localStorage.setItem(STORAGE_KEY, String(val));
    setEditing(false);
  }

  function handleClear() {
    setGoal(null);
    setInputVal('');
    localStorage.removeItem(STORAGE_KEY);
    setEditing(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-border p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Savings Goal</p>
            <p className="text-xs text-muted-foreground">Track progress toward your target</p>
          </div>
        </div>
        {goal && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Set Goal Form */}
      {editing && (
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">AED</span>
            <input
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. 10000"
              className="w-full bg-white/5 border border-border rounded-xl pl-12 pr-3 py-2.5 text-foreground text-sm font-semibold placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            onClick={handleSave}
            className="gold-gradient text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Set Goal
          </button>
          {goal && (
            <button
              onClick={() => setEditing(false)}
              className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Progress Display */}
      {goal && !editing && (
        <div className="space-y-3">
          {/* Amounts row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Current Savings</p>
              <p className="text-lg font-bold font-space text-foreground">AED {current.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Goal</p>
              <p className="text-lg font-bold font-space text-foreground">AED {goal.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${barColor}`}
            />
          </div>

          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {progress >= 100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className={`text-sm font-bold font-space ${textColor}`}>{progress}%</span>
              )}
              <span className="text-xs text-muted-foreground">
                {progress >= 100 ? 'Goal reached! 🎉' : `${progress}% complete`}
              </span>
            </div>
            {progress < 100 && (
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-semibold">AED {remaining.toLocaleString()}</span> remaining
              </p>
            )}
          </div>

          {/* ETA hint using monthlySurplus from sessionStorage */}
          <ETA remaining={remaining} goal={goal} />

          {/* Clear button */}
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-rose-400 transition-colors mt-1"
          >
            Clear goal
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ETA({ remaining, goal }) {
  if (remaining <= 0) return null;

  const raw = sessionStorage.getItem('finova_data');
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  const d = Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, parseFloat(v) || 0]));
  const totalExpenses = (d.rent || 0) + (d.food || 0) + (d.transport || 0) + (d.shopping || 0) + (d.other || 0);
  const monthlySurplus = d.monthly_income - totalExpenses;

  if (monthlySurplus <= 0) {
    return (
      <p className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">
        ⚠️ With your current surplus, reaching this goal requires reducing expenses first.
      </p>
    );
  }

  const months = Math.ceil(remaining / monthlySurplus);
  const label = months === 1 ? '1 month' : months > 24 ? `${Math.round(months / 12)} years` : `${months} months`;

  return (
    <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
      📅 At your current surplus of <span className="text-foreground font-semibold">AED {monthlySurplus.toLocaleString()}/mo</span>, you'll reach your goal in approximately <span className="text-primary font-semibold">{label}</span>.
    </p>
  );
}