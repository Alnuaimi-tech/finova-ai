import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, BookOpen, ArrowLeft, GraduationCap, DollarSign, Shield, TrendingUp, CreditCard, Lightbulb } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';

const modules = [
  {
    icon: DollarSign,
    color: 'text-gold',
    bg: 'bg-yellow-500/10',
    title: 'The 50/30/20 Rule',
    description: 'The most widely taught personal finance framework in UAE universities.',
    points: [
      '50% → Needs (rent, food, transport)',
      '30% → Wants (shopping, dining out)',
      '20% → Savings and investments',
    ],
    tag: 'Budgeting',
  },
  {
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Emergency Fund',
    description: 'A financial buffer that protects you from unexpected expenses.',
    points: [
      'Target: 3–6 months of living expenses',
      'Keep it liquid (savings account)',
      'Never invest your emergency fund',
    ],
    tag: 'Safety Net',
  },
  {
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Compound Interest',
    description: 'The most powerful financial concept for students to understand early.',
    points: [
      'Start investing early — even AED 200/month',
      'UAE-based platforms: StashAway, Sarwa',
      'Time in market > timing the market',
    ],
    tag: 'Investing',
  },
  {
    icon: CreditCard,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    title: 'Debt Awareness',
    description: 'Understanding the true cost of credit and buy-now-pay-later schemes.',
    points: [
      'BNPL services can create spending traps',
      'Credit card interest: 18–36% in UAE',
      'Good debt vs. bad debt explained',
    ],
    tag: 'Debt',
  },
  {
    icon: Lightbulb,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'UAE Student Benefits',
    description: 'Financial perks available to students in the UAE that many don\'t use.',
    points: [
      'RTA student discount cards for transport',
      'Free ADGM financial literacy workshops',
      'University meal plans vs. dining out comparison',
    ],
    tag: 'UAE-Specific',
  },
  {
    icon: GraduationCap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Income Diversification',
    description: 'How UAE students can legally earn additional income.',
    points: [
      'Freelancing on Upwork, Fiverr (allowed for UAE residents)',
      'Campus employment opportunities',
      'Selling digital products and services',
    ],
    tag: 'Income',
  },
];

export default function Education() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-lg text-foreground tracking-tight">FINOVA AI</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <BookOpen className="w-3 h-3" />
            Financial Education Module
          </div>
          <h1 className="text-2xl md:text-4xl font-space font-bold text-foreground mb-3">
            Learn Financial Intelligence
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Core financial concepts curated specifically for students in the UAE. Understanding these principles is the foundation of financial stability.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl border border-border p-5 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${mod.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${mod.color}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mod.bg} ${mod.color}`}>
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 font-space">{mod.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{mod.description}</p>
                <ul className="space-y-2">
                  {mod.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${mod.color.replace('text-', 'bg-')} flex-shrink-0`} />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 glass-card rounded-2xl border border-border p-6 text-center"
        >
          <GraduationCap className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="text-lg font-space font-semibold text-foreground mb-2">Ready to analyze your finances?</h3>
          <p className="text-sm text-muted-foreground mb-4">Apply what you've learned — run your personalized financial analysis.</p>
          <button
            onClick={() => navigate('/')}
            className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Start Analysis
          </button>
        </motion.div>
      </div>
      <MobileNav />
    </div>
  );
}