import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ChevronDown,
  GraduationCap, ShoppingBag, Briefcase, BookOpen, Wrench,
  Laptop, Stethoscope, Building2, LineChart, Compass, MoreHorizontal,
} from 'lucide-react';

const OPTIONS = [
  { value: 'Student / Part-time', icon: GraduationCap },
  { value: 'Retail & Hospitality', icon: ShoppingBag },
  { value: 'Administrative / Office', icon: Briefcase },
  { value: 'Teacher', icon: BookOpen },
  { value: 'Engineer', icon: Wrench },
  { value: 'IT / Software', icon: Laptop },
  { value: 'Healthcare', icon: Stethoscope },
  { value: 'Government', icon: Building2 },
  { value: 'Finance / Banking', icon: LineChart },
  { value: 'Freelancer / Self-employed', icon: Compass },
  { value: 'Other', icon: MoreHorizontal },
];

export default function ProfessionSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = OPTIONS.find((o) => o.value === value) || OPTIONS[OPTIONS.length - 1];
  const SelectedIcon = selected.icon;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full bg-secondary/40 border rounded-2xl px-4 py-4 flex items-center gap-3.5 text-left transition-all duration-300 ${
          open
            ? 'border-primary/60 bg-secondary/60'
            : 'border-border hover:border-border/80'
        }`}
        style={
          open
            ? { boxShadow: '0 0 0 1px rgba(201,162,39,0.45), 0 0 28px rgba(201,162,39,0.16)' }
            : undefined
        }
      >
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            open ? 'bg-primary/15 text-primary' : 'bg-blue-500/10 text-blue-400'
          }`}
        >
          <SelectedIcon className="w-5 h-5" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wide font-semibold leading-none mb-1">
            Profession
          </span>
          <span className="block text-base font-bold text-foreground font-space truncate">
            {selected.value}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 glass-card rounded-2xl border border-border p-1.5 max-h-72 overflow-y-auto scrollbar-none shadow-2xl"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,162,39,0.12)' }}
          >
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    active
                      ? 'bg-primary/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      active
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/60 text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span
                    className={`flex-1 text-sm font-semibold transition-colors ${
                      active ? 'text-primary' : 'text-foreground group-hover:text-foreground'
                    }`}
                  >
                    {opt.value}
                  </span>
                  {active && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}