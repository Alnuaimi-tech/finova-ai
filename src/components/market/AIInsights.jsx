import { useState } from 'react';
import { Brain, Zap, TrendingUp, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const INSIGHTS = [
  {
    type: 'bullish', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    title: 'ADNOC Distribution — Strong Buy Signal',
    body: 'Government-backed energy sector showing resilience. Oil prices stable above $80/barrel. Dividend yield at 4.2% — above UAE average.',
    confidence: 87, tag: 'ADX · Energy',
  },
  {
    type: 'neutral', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    title: 'Emaar Properties — Hold Position',
    body: 'Real estate sector cooling after H1 2024 rally. Off-plan sales strong but secondary market softening. Watch for Q2 earnings.',
    confidence: 61, tag: 'DFM · Real Estate',
  },
  {
    type: 'warning', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
    title: 'Tesla (TSLA) — Elevated Risk',
    body: 'EV demand slowdown and margin pressure. High volatility expected before earnings. Not recommended for student portfolios.',
    confidence: 72, tag: 'NASDAQ · EV',
  },
  {
    type: 'bullish', icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
    title: 'FAB — Stable Long-Term Pick',
    body: 'UAE\'s largest bank continues to benefit from high interest rate environment. Tier-1 capital ratio well above requirements.',
    confidence: 81, tag: 'ADX · Banking',
  },
];

export default function AIInsights() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="glass-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-primary" />
        <p className="text-sm font-bold text-foreground">AI Investment Insights</p>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">Simulated</span>
      </div>

      <div className="space-y-2">
        {INSIGHTS.map((ins, i) => {
          const Icon = ins.icon;
          const isOpen = expanded === i;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`rounded-xl border transition-all cursor-pointer ${ins.border} ${ins.bg}`}
              onClick={() => setExpanded(isOpen ? -1 : i)}>
              <div className="flex items-center gap-3 p-3">
                <Icon className={`w-4 h-4 ${ins.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{ins.title}</p>
                  <p className="text-xs text-muted-foreground">{ins.tag}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                    <p className={`text-xs font-bold ${ins.color}`}>{ins.confidence}%</p>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
              </div>
              {isOpen && (
                <div className="px-3 pb-3 border-t border-white/5 pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ins.confidence}%`, background: ins.type === 'bullish' ? '#10b981' : ins.type === 'warning' ? '#f43f5e' : '#f59e0b' }} />
                    </div>
                    <span className={`text-xs font-bold ${ins.color}`}>{ins.confidence}% confidence</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">⚠️ This is AI-generated educational content only — not financial advice.</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}