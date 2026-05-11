import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, Brain, TrendingUp, Shield, BookOpen, Zap, BarChart3 } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Explanation Engine', desc: 'Contextual analysis of your financial behavior with human-like reasoning', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: BarChart3, title: 'Stability Score (0–100)', desc: 'Multi-factor score based on savings, expenses, and spending risk', color: 'text-gold', bg: 'bg-yellow-500/10' },
  { icon: TrendingUp, title: '3-Month Prediction', desc: 'AI-generated financial trajectory simulation for the next 90 days', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Shield, title: 'Risk Classification', desc: 'Instant risk profiling: High, Medium, or Low — with detailed explanation', color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const pipeline = [
  'User Input', 'Processing', 'AI Analysis', 'Risk Score', 'Prediction', 'Insights', 'Education'
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 gold-gradient rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-space font-bold text-xl text-foreground tracking-tight">FINOVA</span>
              <span className="font-space font-bold text-xl text-primary ml-1">AI</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/education')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Education
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 tracking-wide">
            <Zap className="w-3 h-3" />
            AI-POWERED FINANCIAL INTELLIGENCE FOR UAE STUDENTS
          </div>

          <h1 className="text-5xl md:text-7xl font-space font-bold text-foreground mb-4 leading-tight tracking-tight">
            Know Your
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(43,96%,56%), hsl(38,92%,45%))' }}>
              Financial Reality
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            FINOVA AI analyzes your income, expenses, and behavior to generate a personalized financial stability score, risk profile, and 3-month prediction — built specifically for students in the UAE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/analyze')}
              className="gold-gradient text-primary-foreground px-8 py-4 rounded-2xl font-space font-bold text-base flex items-center gap-3 shadow-xl"
            >
              <Cpu className="w-5 h-5" />
              Start AI Analysis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={() => navigate('/education')}
              className="glass-card border border-border px-8 py-4 rounded-2xl font-medium text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Learn First
            </button>
          </div>
        </motion.div>

        {/* AI Pipeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 glass-card rounded-2xl border border-border p-6"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-5">How the AI System Works</p>
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {pipeline.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center px-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-1">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{step}</span>
                </div>
                {i < pipeline.length - 1 && (
                  <div className="text-muted-foreground/30 text-lg mx-0.5">›</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="relative max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="glass-card rounded-2xl border border-border p-5 hover:border-white/10 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 font-space">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-12"
        >
          <p className="text-xs text-muted-foreground">
            🇦🇪 Designed for students across UAE universities · ADNOC, UAEU, AUS, NYU Abu Dhabi, AUD
          </p>
        </motion.div>
      </div>
    </div>
  );
}