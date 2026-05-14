import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCw, BookOpen, TrendingUp, Brain, ChevronRight, Sparkles, LayoutDashboard, Sliders, Wallet, PiggyBank, ReceiptText, ShieldAlert, MessageCircle, FlaskConical } from 'lucide-react';
import AIPipeline from '../components/finova/AIPipeline';
import ScoreGauge from '../components/finova/ScoreGauge';
import ExpenseChart from '../components/finova/ExpenseChart';
import AIInsightCard from '../components/finova/AIInsightCard';
import PredictionCard from '../components/finova/PredictionCard';
import RecommendationCard from '../components/finova/RecommendationCard';
import ScoreBreakdown from '../components/finova/ScoreBreakdown';
import AIReasoningEngine from '../components/finova/AIReasoningEngine';
import SavingsGoal from '../components/finova/SavingsGoal';
import {
  calculateFinancialScore,
  classifyRisk,
  getRiskColor,
  generateAIExplanations,
  generatePredictions,
  generateRecommendations,
  getRiskTrend,
  simulateScenario,
} from '../lib/financialEngine';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'reasoning', label: 'AI Reasoning', icon: Brain },
  { id: 'insights', label: 'AI Insights', icon: FlaskConical },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'recommendations', label: 'Action Plan', icon: Sparkles },
  { id: 'scenarios', label: 'Scenarios', icon: Sliders },
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
  const [riskTrend, setRiskTrend] = useState(null);

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
    setRiskTrend(getRiskTrend(m));
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
            <button
              onClick={() => navigate('/analyst')}
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              AI Analyst
            </button>
            <a
              href="/stocks"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Stocks
            </a>
            <a
              href="/ai-model"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              AI Model
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Score Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center glow-gold"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Financial Stability Score</p>
            <ScoreGauge score={metrics.score} riskLevel={riskLevel} riskColor={riskColor} />
            {riskTrend && (
              <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${riskTrend.bg} ${riskTrend.color}`}>
                <span>{riskTrend.arrow}</span>
                <span>Trend: {riskTrend.label}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center mt-3 max-w-[200px] leading-relaxed">
              Calculated from savings behavior, expense patterns, and spending risk
            </p>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border p-6 space-y-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Score Breakdown</p>
            <ScoreBreakdown metrics={metrics} />
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

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Wallet, label: 'Monthly Income', value: `AED ${data.monthly_income.toLocaleString()}`, color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { icon: ReceiptText, label: 'Total Expenses', value: `AED ${metrics.totalExpenses.toLocaleString()}`, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { icon: PiggyBank, label: 'Monthly Surplus', value: `${metrics.monthlySurplus >= 0 ? '+' : ''}AED ${metrics.monthlySurplus.toLocaleString()}`, color: metrics.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400', bg: metrics.monthlySurplus >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10', border: metrics.monthlySurplus >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20' },
            { icon: ShieldAlert, label: 'Savings Rate', value: `${metrics.savingsRate}%`, color: metrics.savingsRate >= 20 ? 'text-emerald-400' : metrics.savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400', bg: metrics.savingsRate >= 20 ? 'bg-emerald-500/10' : metrics.savingsRate >= 10 ? 'bg-amber-500/10' : 'bg-rose-500/10', border: metrics.savingsRate >= 20 ? 'border-emerald-500/20' : metrics.savingsRate >= 10 ? 'border-amber-500/20' : 'border-rose-500/20' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                className={`glass-card rounded-2xl border ${stat.border} ${stat.bg} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-lg font-bold font-space ${stat.color}`}>{stat.value}</p>
              </motion.div>
            );
          })}
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
              <SavingsGoal currentSavings={data.current_savings} />
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

          {activeTab === 'reasoning' && (
            <motion.div
              key="reasoning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AIReasoningEngine data={data} metrics={metrics} />
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
                  riskTrend={riskTrend}
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

          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="glass-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">What-If Scenario Simulation</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  See how targeted changes to your spending habits would affect your FINOVA score and risk tier.
                </p>
              </div>
              {['reduce_shopping_10pct', 'reduce_rent', 'boost_savings'].map((scenarioType) => {
                const sim = simulateScenario(data, metrics, scenarioType);
                const simRiskColor = getRiskColor(sim.newRisk);
                const riskChanged = sim.newRisk !== riskLevel;
                return (
                  <motion.div key={scenarioType} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl border border-border p-5">
                    <p className="text-sm font-semibold text-foreground mb-4">
                      💡 What if you <span className="text-primary">{sim.label.toLowerCase()}</span>?
                    </p>

                    {/* BEFORE vs AFTER */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="rounded-xl bg-secondary/30 border border-border p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">BEFORE</p>
                        <p className="text-3xl font-bold font-space mb-1" style={{ color: riskColor.hex }}>{metrics.score}</p>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${riskColor.bg} ${riskColor.border} ${riskColor.text}`}>{riskLevel}</span>
                      </div>
                      <div className={`rounded-xl border p-4 text-center ${simRiskColor.bg} ${simRiskColor.border}`}>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">AFTER</p>
                        <p className="text-3xl font-bold font-space mb-1" style={{ color: simRiskColor.hex }}>{sim.newScore}</p>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${simRiskColor.bg} ${simRiskColor.border} ${simRiskColor.text}`}>{sim.newRisk}</span>
                      </div>
                    </div>

                    {/* Change summary */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${sim.scoreDelta > 0 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : sim.scoreDelta < 0 ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-muted-foreground bg-secondary/30 border border-border'}`}>
                        Score change: {sim.scoreDelta > 0 ? '+' : ''}{sim.scoreDelta} pts
                      </div>
                      {riskChanged && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
                          Risk: {riskLevel} → {sim.newRisk}
                        </div>
                      )}
                      {!riskChanged && (
                        <span className="text-xs text-muted-foreground">Risk tier unchanged</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}