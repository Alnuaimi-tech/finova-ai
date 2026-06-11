import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, Brain, BarChart3, TrendingUp, BookOpen, Zap, Star, Shield, Target, ChevronRight, Sparkles } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import TryDemoForm from '../components/finova/TryDemoForm';
import DemoPreview from '../components/finova/DemoPreview';
import { base44 } from '@/api/base44Client';

const features = [
  { icon: BarChart3, title: 'Financial Score', titleAr: 'النتيجة المالية', desc: 'Your money health in one clear number — 0 to 100', color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { icon: Brain, title: 'AI Coach', titleAr: 'مستشار ذكي', desc: 'Personalized advice based on your real UAE spending patterns', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: TrendingUp, title: 'Market Tracker', titleAr: 'تتبع السوق', desc: 'Follow ADX & DFM stocks. Learn investing the smart way', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: BookOpen, title: 'Money Lessons', titleAr: 'دروس مالية', desc: 'Short, practical guides made for UAE students & young adults', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { icon: Target, title: 'Goal Tracker', titleAr: 'متابعة الأهداف', desc: 'Set savings goals and track your progress every month', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Shield, title: 'Emergency Fund', titleAr: 'صندوق الطوارئ', desc: 'Build a safety net — 3 months of expenses as a buffer', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
];

const stats = [
  { value: '10,000+', label: 'UAE Students', sub: 'Using FINOVA AI' },
  { value: 'AED', label: 'Currency', sub: 'Fully localized' },
  { value: '2 min', label: 'Analysis', sub: 'Get your score fast' },
  { value: '100%', label: 'Free', sub: 'No credit card' },
];

const universities = ['UAEU', 'AUS', 'NYU Abu Dhabi', 'AUD', 'Khalifa Univ', 'Zayed Univ', 'HCT', 'BITS Pilani Dubai'];

export default function Home() {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  useEffect(() => {
    const key = 'finova_opened';
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      const sessionId = sessionStorage.getItem('finova_session') || (() => { const id = Math.random().toString(36).slice(2); sessionStorage.setItem('finova_session', id); return id; })();
      base44.entities.AppEvent.create({ event_type: 'app_open', session_id: sessionId }).catch(() => {});
    }
  }, []);

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/4 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-500/4 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/40 px-4 md:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gold-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-space font-bold text-xl text-foreground tracking-tight">FINOVA</span>
              <span className="font-space font-bold text-xl text-primary">AI</span>
              <span className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-1 font-medium">UAE 🇦🇪</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { label: 'Market', to: '/market' },
              { label: 'Learn', to: '/learn' },
              { label: 'Profile', to: '/profile' },
            ].map(n => (
              <button key={n.to} onClick={() => navigate(n.to)}
                className="text-xs text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-lg px-3 py-2 transition-all">
                {n.label}
              </button>
            ))}
            <button onClick={() => setDemoMode('form')}
              className="gold-gradient text-primary-foreground px-4 py-2 rounded-lg font-space font-semibold text-xs ml-2 hover:opacity-90 transition-opacity">
              Try Free
            </button>
          </nav>
          <button onClick={() => navigate('/analyze')}
            className="md:hidden gold-gradient text-primary-foreground px-4 py-2 rounded-xl font-space font-bold text-sm">
            Start
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" />
            #1 Financial App for UAE Students
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
            Your personal
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(43,96%,56%), hsl(38,92%,45%))' }}>
              money coach
            </span>
            powered by AI
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Get your <strong className="text-foreground">Financial Health Score</strong> in 2 minutes. 
            FINOVA AI analyzes your income, spending, and savings to give you a clear action plan — all in AED, built for UAE students and young professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setDemoMode('form'); setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100); }}
              className="w-full sm:w-auto gold-gradient text-primary-foreground px-8 py-4 rounded-2xl font-space font-bold text-base flex items-center justify-center gap-3 shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Check My Financial Score
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button onClick={() => navigate('/learn')}
              className="w-full sm:w-auto glass-card border border-border px-8 py-4 rounded-2xl font-medium text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-all flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learn First
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className="glass-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-space font-bold text-primary">{s.value}</p>
                <p className="text-xs font-semibold text-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex -space-x-2">
              {['🧑‍🎓', '👩‍🎓', '🧑‍💼', '👨‍🎓', '👩‍💼'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm">{e}</div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-primary fill-primary" />)}
              <span className="text-xs text-muted-foreground ml-1">Trusted by students at {universities.slice(0, 3).join(', ')} & more</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Demo Section */}
      <AnimatePresence>
        {demoMode && (
          <motion.section key="demo" id="demo-section"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="relative max-w-6xl mx-auto px-4 md:px-6 pb-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-space font-bold text-foreground">Get Your Financial Score — Free</h2>
              <p className="text-sm text-muted-foreground mt-1">No account needed. Takes 2 minutes.</p>
            </div>
            {demoMode === 'form' && <TryDemoForm onResult={handleDemoResult} />}
            {demoMode === 'result' && demoResult && (
              <DemoPreview
                data={demoResult.data} metrics={demoResult.metrics}
                riskLevel={demoResult.riskLevel} riskColor={demoResult.riskColor}
                insights={demoResult.insights} onReset={handleReset}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* How it works */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl border border-border p-6 md:p-8 mb-8">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium text-center mb-6">How FINOVA AI Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Enter Your Numbers', desc: 'Income, rent, food, transport — takes 2 minutes', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { step: '02', title: 'AI Analyzes Your Data', desc: 'Our engine scores your finances 0–100 using UAE benchmarks', color: 'text-gold', bg: 'bg-yellow-500/10' },
              { step: '03', title: 'Get Your Action Plan', desc: 'Personalized tips, predictions, and goals to improve your score', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center`}>
                  <span className={`text-xl font-space font-bold ${s.color}`}>{s.step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className={`glass-card rounded-2xl border ${feat.border} p-5 flex gap-4 items-start hover:bg-white/2 transition-all duration-300`}>
                <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-foreground font-space">{feat.title}</h3>
                    <span className="text-[10px] text-muted-foreground font-medium">{feat.titleAr}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* UAE Localization Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="text-4xl">🇦🇪</div>
            <div className="flex-1">
              <h3 className="text-base font-space font-bold text-foreground mb-1">Built for the UAE</h3>
              <p className="text-sm text-muted-foreground">AED currency · UAE university expenses · Metro & Salik transport · Etisalat/du mobile plans · ADX & DFM investing education · UAE banking guide</p>
            </div>
            <button onClick={() => { setDemoMode('form'); setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100); }}
              className="flex-shrink-0 gold-gradient text-primary-foreground px-5 py-2.5 rounded-xl font-space font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
              Get My Score
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-center">
          <button onClick={() => { setDemoMode('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="gold-gradient text-primary-foreground px-10 py-4 rounded-2xl font-space font-bold text-sm inline-flex items-center gap-3 shadow-lg hover:opacity-90 transition-opacity">
            <Star className="w-4 h-4" />
            Try FINOVA AI — 100% Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">🏛️ {universities.join(' · ')}</p>
        </motion.div>
      </section>

      <MobileNav />
    </div>
  );
}