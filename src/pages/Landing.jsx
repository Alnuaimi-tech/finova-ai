import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, Brain, TrendingUp, Shield, BookOpen, Zap, BarChart3, LineChart, Building2 } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';

const features = [
  { icon: Brain, title: 'AI Explanation Engine', desc: 'Contextual analysis tailored to UAE student spending patterns and AED-based expenses', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: BarChart3, title: 'Stability Score (0–100)', desc: 'Multi-factor score benchmarked against UAE student financial norms and cost of living', color: 'text-gold', bg: 'bg-yellow-500/10' },
  { icon: TrendingUp, title: '3-Month Prediction', desc: 'AI-generated trajectory based on Dubai & Abu Dhabi living costs and your spending habits', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Shield, title: 'Risk Classification', desc: 'Instant risk profiling aligned with UAE financial benchmarks — High, Medium, or Low', color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const pipeline = [
  'User Input', 'Processing', 'AI Analysis', 'Risk Score', 'Prediction', 'Insights', 'Education'
];

const companies = [
  { name: 'ADNOC', sector: 'Energy' },
  { name: 'Emirates NBD', sector: 'Banking' },
  { name: 'Etisalat (e&)', sector: 'Telecom' },
  { name: 'Emaar', sector: 'Real Estate' },
  { name: 'DP World', sector: 'Logistics' },
  { name: 'FAB', sector: 'Banking' },
  { name: 'Aldar', sector: 'Real Estate' },
  { name: 'Dubai Airports', sector: 'Aviation' },
];

const universities = ['UAEU', 'AUS', 'NYU Abu Dhabi', 'AUD', 'Khalifa University', 'Zayed University', 'HCT'];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-16 md:pb-0">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/40 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 md:w-9 md:h-9 gold-gradient rounded-xl flex items-center justify-center">
              <Cpu className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-space font-bold text-lg md:text-xl text-foreground tracking-tight">FINOVA</span>
              <span className="font-space font-bold text-lg md:text-xl text-primary ml-1">AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate('/market')}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg px-3 py-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Market Dashboard
            </button>
            <button
              onClick={() => navigate('/stocks')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
            >
              <LineChart className="w-3.5 h-3.5" />
              UAE Stocks
            </button>
            <button
              onClick={() => navigate('/education')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Education
            </button>
          </div>
          <button
            onClick={() => navigate('/analyze')}
            className="md:hidden gold-gradient text-primary-foreground px-4 py-2 rounded-xl font-space font-bold text-sm"
          >
            Start
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-8 md:pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-semibold mb-4 md:mb-6 tracking-wide">
            <Zap className="w-3 h-3" />
            🇦🇪 AI-POWERED — BUILT FOR UAE STUDENTS
          </div>

          <h1 className="text-4xl md:text-7xl font-space font-bold text-foreground mb-3 md:mb-4 leading-tight tracking-tight">
            Your UAE Student
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(43,96%,56%), hsl(38,92%,45%))' }}>
              Financial Reality
            </span>
          </h1>

          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto mb-7 md:mb-10 leading-relaxed">
            FINOVA AI analyzes your AED income, UAE living expenses, and spending behavior to generate a personalized stability score, risk profile, and 3-month prediction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
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
      <div className="relative max-w-5xl mx-auto px-6 pb-10">
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
      </div>

      {/* UAE Companies Section */}
      <div className="relative max-w-5xl mx-auto px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">UAE's Top Companies — Know Where to Invest</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {companies.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75 + i * 0.05 }}
                className="rounded-xl bg-secondary/30 border border-border px-4 py-3 text-center hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => navigate('/stocks')}
              >
                <p className="text-sm font-bold font-space text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.sector}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Tap any company to explore UAE stocks and investment readiness →
          </p>
        </motion.div>
      </div>

      {/* Bottom badge */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 pb-8 md:pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            🇦🇪 Designed for students across UAE universities · {universities.join(' · ')}
          </p>
        </motion.div>
      </div>
      <MobileNav />
    </div>
  );
}