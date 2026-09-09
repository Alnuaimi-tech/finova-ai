import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, BookOpen, Zap, Star, ChevronRight, Sparkles } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import TryDemoForm from '../components/finova/TryDemoForm';
import DemoPreview from '../components/finova/DemoPreview';
import HubQuickAccess from '../components/finova/HubQuickAccess';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';

const STATS_VALUES = ['10,000+', 'AED', '2 min', '100%'];
const STATS_TKEYS = [
  { label: 'stat1Label', sub: 'stat1Sub' },
  { label: 'stat2Label', sub: 'stat2Sub' },
  { label: 'stat3Label', sub: 'stat3Sub' },
  { label: 'stat4Label', sub: 'stat4Sub' },
];

const universities = ['UAEU', 'AUS', 'NYU Abu Dhabi', 'AUD', 'Khalifa Univ', 'Zayed Univ', 'HCT', 'BITS Pilani Dubai'];

export default function Home() {
  const navigate = useNavigate();
  const { lang, toggle, t } = useLanguage();
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
              { label: t.market, to: '/market' },
              { label: t.learn, to: '/learn' },
              { label: t.profile, to: '/profile' },
            ].map(n => (
              <button key={n.to} onClick={() => navigate(n.to)}
                className="text-xs text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-lg px-3 py-2 transition-all">
                {n.label}
              </button>
            ))}
            <button onClick={toggle}
              className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 transition-all font-medium">
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <button onClick={() => setDemoMode('form')}
              className="gold-gradient text-primary-foreground px-4 py-2 rounded-lg font-space font-semibold text-xs ml-1 hover:opacity-90 transition-opacity">
              {t.tryFree}
            </button>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle}
              className="text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-2 transition-all font-medium">
              {lang === 'en' ? 'ع' : 'EN'}
            </button>
            <button onClick={() => navigate('/analyze')}
              className="gold-gradient text-primary-foreground px-4 py-2 rounded-xl font-space font-bold text-sm">
              {lang === 'en' ? 'Start' : 'ابدأ'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" />
            {t.tagline}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
            {t.heroTitle1}
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, hsl(43,96%,56%), hsl(38,92%,45%))' }}>
              {t.heroTitle2}
            </span>
            {t.heroTitle3}
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setDemoMode('form'); setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100); }}
              className="w-full sm:w-auto gold-gradient text-primary-foreground px-8 py-4 rounded-2xl font-space font-bold text-base flex items-center justify-center gap-3 shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              {t.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button onClick={() => navigate('/learn')}
              className="w-full sm:w-auto glass-card border border-border px-8 py-4 rounded-2xl font-medium text-sm text-muted-foreground hover:text-foreground hover:border-white/10 transition-all flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t.ctaSecondary}
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
            {STATS_VALUES.map((val, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className="glass-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-space font-bold text-primary">{val}</p>
                <p className="text-xs font-semibold text-foreground">{t[STATS_TKEYS[i].label]}</p>
                <p className="text-[10px] text-muted-foreground">{t[STATS_TKEYS[i].sub]}</p>
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

      {/* Quick Hub Access */}
      <HubQuickAccess />

      {/* Demo Section */}
      <AnimatePresence>
        {demoMode && (
          <motion.section key="demo" id="demo-section"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="relative max-w-6xl mx-auto px-4 md:px-6 pb-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-space font-bold text-foreground">{t.demoTitle}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t.demoSubtitle}</p>
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
        {/* UAE Localization Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="text-4xl">🇦🇪</div>
            <div className="flex-1">
              <h3 className="text-base font-space font-bold text-foreground mb-1">{t.uaeTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.uaeDesc}</p>
              </div>
              <button onClick={() => { setDemoMode('form'); setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100); }}
              className="flex-shrink-0 gold-gradient text-primary-foreground px-5 py-2.5 rounded-xl font-space font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
              {t.getMyScore}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-center">
          <button onClick={() => { setDemoMode('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="gold-gradient text-primary-foreground px-10 py-4 rounded-2xl font-space font-bold text-sm inline-flex items-center gap-3 shadow-lg hover:opacity-90 transition-opacity">
            <Star className="w-4 h-4" />
            {t.bottomCta}
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">🏛️ {universities.join(' · ')}</p>
        </motion.div>
      </section>

      <MobileNav />
    </div>
  );
}