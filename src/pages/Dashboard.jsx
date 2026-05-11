import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCw, BookOpen, TrendingUp, Brain, ChevronRight, Sparkles, LayoutDashboard } from 'lucide-react';
import AIPipeline from '../components/finova/AIPipeline';
import ScoreGauge from '../components/finova/ScoreGauge';
import ExpenseChart from '../components/finova/ExpenseChart';
import AIInsightCard from '../components/finova/AIInsightCard';
import PredictionCard from '../components/finova/PredictionCard';
import RecommendationCard from '../components/finova/RecommendationCard';
import ScoreBreakdown from '../components/finova/ScoreBreakdown';
import {
  calculateFinancialScore,
  classifyRisk,
  getRiskColor,
  generateAIExplanations,
  generatePredictions,
  generateRecommendations,
} from '../lib/financialEngine';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'recommendations', label: 'Action Plan', icon: Sparkles },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [riskLevel, setRiskLevel] = useState('');
  const [riskColor, setRiskColor] = useState({});
  const [insights, setInsights] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const raw = sessionStorage.getItem('finova_data');
    if (!raw) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(raw);
    const numericData = Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, parseFloat(v) || 0])
    );
    setData(numericData);

    const m = calculateFinancialScore(numericData);
    const rl = classifyRisk(m.score);
    const rc = getRiskColor(rl);
    const ex = generateAIExplanations(numericData, m);
    const pred = generatePredictions(numericData, m);
    const recs = generateRecommendations(numericData, m, rl);

    setMetrics(m);
    setRiskLevel(rl);
    setRiskColor(rc);
    setInsights(ex);
    setPredictionData(pred);
    setRecommendations(recs);
  }, [navigate]);

  if (!data || !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-lg text-foreground tracking-tight">FINOVA AI</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/stocks"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Stocks
            </a>
            <a
              href="/education"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Education
            </a>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Analysis
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* AI Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-border p-4 mb-8"
        >
          <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-widest font-medium">AI Analysis Complete</p>
          <AIPipeline activeStep={6} />
        </motion.div>

        {/* Hero Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center glow-gold"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Financial Stability Score</p>
            <ScoreGauge score={metrics.score} riskLevel={riskLevel} riskColor={riskColor} />
            <p className="text-xs text-muted-foreground text-center mt-4 max-w-[200px] leading-relaxed">
              Calculated from savings behavior, expense patterns, and spending risk
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border p-6 space-y-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Score Breakdown</p>
            <ScoreBreakdown metrics={metrics} />
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Income</span>
                <span className="font-semibold text-gold">AED {data.monthly_income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-foreground">AED {metrics.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Surplus</span>
                <span className={`font-semibold ${metrics.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.monthlySurplus >= 0 ? '+' : ''}AED {metrics.monthlySurplus.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className={`font-semibold ${metrics.savingsRate >= 20 ? 'text-emerald-400' : metrics.savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {metrics.savingsRate}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Expense Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border p-6"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Expense Distribution</p>
            <p className="text-xs text-muted-foreground mb-2">% of monthly income — AED {data.monthly_income.toLocaleString()}</p>
            <ExpenseChart data={data} income={data.monthly_income} />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl border border-border mb-6 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.slice(0, 4).map((insight, i) => (
                  <AIInsightCard key={i} insight={insight} index={i} />
                ))}
              </div>
              <button
                onClick={() => setActiveTab('insights')}
                className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                View All AI Insights <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="glass-card rounded-xl border border-border p-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AI Explanation Engine</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  The following insights are generated by analyzing your financial data patterns against UAE student benchmarks.
                </p>
              </div>
              {insights.map((insight, i) => (
                <AIInsightCard key={i} insight={insight} index={i} />
              ))}
            </motion.div>
          )}

          {activeTab === 'predictions' && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="glass-card rounded-xl border border-border p-4 mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">3-Month Financial Projection</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Simulation based on current income, expense patterns, and savings behavior.
                </p>
              </div>
              {predictionData && (
                <PredictionCard
                  predictions={predictionData.predictions}
                  narrative={predictionData.narrative}
                  currentSavings={data.current_savings}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="glass-card rounded-xl border border-border p-4 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AI-Generated Action Plan</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Personalized recommendations based on your risk profile and spending patterns.
                </p>
              </div>
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}