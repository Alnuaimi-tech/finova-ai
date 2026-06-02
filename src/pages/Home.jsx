import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, Brain, BarChart3, TrendingUp, BookOpen, Zap, Star } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import TryDemoForm from '../components/finova/TryDemoForm';
import DemoPreview from '../components/finova/DemoPreview';

const features = [
  { icon: BarChart3, title: 'Financial Score', desc: 'See your money health in one clear number — 0 to 100', color: 'text-gold', bg: 'bg-yellow-500/10' },
  { icon: Brain, title: 'AI Advice', desc: 'Get personal tips based on your real income and spending', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: TrendingUp, title: 'Market Tracker', desc: 'Follow UAE stocks and learn investing the smart way', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: BookOpen, title: 'Money Lessons', desc: 'Short, practical guides made for UAE students', color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

const universities = ['UAEU', 'AUS', 'NYU Abu Dhabi', 'AUD', 'Khalifa Univ', 'Zayed Univ', 'HCT'];

export default function Home() {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(false); // 'form' | 'result' | false
  const [demoResult, setDemoResult] = useState(null);

  const handleDemoResult = (result) => {
    setDemoResult(result);
    setDemoMode('result');
  };

  const handleReset = () => {
    setDemoResult(null);
    setDemoMode('form');
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-24 md:pb-0">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/40 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 gold-gradient rounded-xl flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-space font-bold text-xl text-foreground tracking-tight">FINOVA</span>
              <span className="font-space font-bold text-xl text-primary ml-1">AI</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => navigate('/market')} className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">Market</button>
            <button onClick={() => navigate('/learn')} className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">Learn</button>
            <button onClick={() => navigate('/profile')} className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors">Profile</button>
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
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-14 md:pt-24 pb-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
            <Zap className="w-3 h-3" />
            🇦🇪 BUILT FOR UAE STUDENTS
          </div>

          <h1 className="text-4xl md:text-6xl font-space font-bold text-foreground mb-4 leading-tight tracking-tight">
            Take control of
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(43,96%,56%), hsl(38,92%,45%))' }}>
              your money
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            FINOVA AI gives you a personal financial score, smart savings advice, and simple investing education — all in one app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDemoMode('form')}
              className="w-full sm:w-auto gold-gradient text-primary-foreground px-8 py-4 rounded-2xl font-space font-bold text-base flex items-center justify-center gap-3 shadow-xl"
            >
              <Cpu className="w-5 h-5" />
              Try FINOVA AI
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={() => navigate('/learn')}
              className="w-full sm:w-auto glass-card border border-border px-8 py-4 rounded-2xl font-medium text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Learn First
            </button>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          <div className="flex -space-x-2">
            {['🧑‍🎓', '👩‍🎓', '🧑‍💼', '👨‍🎓'].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-base">{e}</div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Used by students at <span className="text-foreground font-medium">{universities.slice(0,3).join(', ')}</span> & more</p>
        </motion.div>
      </div>

      {/* Demo Section */}
      <AnimatePresence>
        {demoMode && (
          <motion.div
            key="demo"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative max-w-5xl mx-auto px-4 md:px-6 pb-8"
          >
            {demoMode === 'form' && <TryDemoForm onResult={handleDemoResult} />}
            {demoMode === 'result' && demoResult && (
              <DemoPreview
                data={demoResult.data}
                metrics={demoResult.metrics}
                riskLevel={demoResult.riskLevel}
                riskColor={demoResult.riskColor}
                insights={demoResult.insights}
                onReset={handleReset}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card rounded-2xl border border-border p-5 flex gap-4 items-start hover:border-white/10 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 font-space">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 glass-card rounded-2xl border border-border p-6"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium text-center mb-5">How it works — 3 steps</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { step: '1', label: 'Enter your income & expenses', color: 'bg-blue-500/10 text-blue-400' },
              { step: '2', label: 'Get your AI financial score', color: 'bg-yellow-500/10 text-gold' },
              { step: '3', label: 'Follow your action plan', color: 'bg-emerald-500/10 text-emerald-400' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center font-space font-bold text-base`}>{s.step}</div>
                <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA bottom */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-6 text-center">
          <button
            onClick={() => { setDemoMode('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="gold-gradient text-primary-foreground px-8 py-3.5 rounded-2xl font-space font-bold text-sm inline-flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          >
            <Star className="w-4 h-4" />
            Try FINOVA AI — Takes 2 Minutes
          </button>
          <p className="text-xs text-muted-foreground mt-3">🇦🇪 {universities.join(' · ')}</p>
        </motion.div>
      </div>
      <MobileNav />
    </div>
  );
}