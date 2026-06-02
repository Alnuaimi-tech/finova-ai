import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RefreshCw, TrendingUp, Brain, ChevronRight, Sparkles, LayoutDashboard, Sliders, Wallet, PiggyBank, ReceiptText, ShieldAlert, MessageCircle, Download, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRef } from 'react';
import { base44 } from '@/api/base44Client';
import MobileNav from '../components/finova/MobileNav';
import { generatePDFReport } from '../lib/generatePDFReport';
import AIPipeline from '../components/finova/AIPipeline';
import ScoreGauge from '../components/finova/ScoreGauge';
import ExpenseChart from '../components/finova/ExpenseChart';
import AIInsightCard from '../components/finova/AIInsightCard';
import PredictionCard from '../components/finova/PredictionCard';
import RecommendationCard from '../components/finova/RecommendationCard';
import ScoreBreakdown from '../components/finova/ScoreBreakdown';
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
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'recommendations', label: 'Action Plan', icon: Sparkles },
  { id: 'scenarios', label: 'Scenarios', icon: Sliders },
  { id: 'analyst', label: 'AI Chat', icon: MessageCircle },
];

// ─── AI Analyst helpers ───────────────────────────────────────────────────────
function buildFinancialContext(data, metrics, riskLevel) {
  if (!data || !metrics) return '';
  const surplus = metrics.monthlySurplus;
  return `\n\n[USER FINANCIAL PROFILE]\nMonthly Income: AED ${data.monthly_income.toLocaleString()}\nTotal Expenses: AED ${metrics.totalExpenses.toLocaleString()}\nMonthly Surplus: AED ${surplus.toLocaleString()}\nSavings Rate: ${metrics.savingsRate}%\nFINOVA Score: ${metrics.score}/100 — ${riskLevel}\n[END PROFILE]\n\nBe specific with AED numbers and give practical UAE-focused advice.`;
}

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
  const [downloading, setDownloading] = useState(false);

  // AI Analyst state
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef(null);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    await generatePDFReport({ data, metrics, riskLevel, insights, recommendations });
    setDownloading(false);
  };

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

  // Init AI Analyst conversation when tab opened
  useEffect(() => {
    if (activeTab !== 'analyst' || conversation) return;
    async function initChat() {
      const conv = await base44.agents.createConversation({ agent_name: 'finova_analyst', metadata: { name: 'Dashboard Chat' } });
      setConversation(conv);
      setMessages(conv.messages || []);
      const unsub = base44.agents.subscribeToConversation(conv.id, (d) => setMessages(d.messages || []));
      return unsub;
    }
    const cleanup = initChat();
    return () => { cleanup.then(fn => fn && fn()); };
  }, [activeTab, conversation]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || !conversation || sending) return;
    const text = chatInput.trim();
    setChatInput('');
    setSending(true);
    const ctx = buildFinancialContext(data, metrics, riskLevel);
    const content = (messages.filter(m => m.role === 'user').length === 0 && ctx) ? `${text}${ctx}` : text;
    await base44.agents.addMessage(conversation, { role: 'user', content });
    setSending(false);
  };

  if (!data || !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-base md:text-lg text-foreground tracking-tight">FINOVA AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg px-2.5 md:px-3 py-1.5 disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{downloading ? 'Generating...' : 'PDF'}</span>
            </button>
            <button
              onClick={() => navigate('/analyze')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2.5 md:px-3 py-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Re-analyze</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 md:px-6 py-4 md:py-8">
        {/* AI Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-border p-3 md:p-4 mb-5 md:mb-8 overflow-x-auto"
        >
          <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-widest font-medium">AI Analysis Complete</p>
          <AIPipeline activeStep={6} />
        </motion.div>

        {/* Hero Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: Wallet, label: 'Monthly Income', value: `AED ${data.monthly_income.toLocaleString()}`, color: 'text-gold', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { icon: ReceiptText, label: 'Total Expenses', value: `AED ${metrics.totalExpenses.toLocaleString()}`, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { icon: PiggyBank, label: 'Monthly Surplus', value: `${metrics.monthlySurplus >= 0 ? '+' : ''}AED ${metrics.monthlySurplus.toLocaleString()}`, color: metrics.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400', bg: metrics.monthlySurplus >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10', border: metrics.monthlySurplus >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20' },
            { icon: ShieldAlert, label: 'Savings Rate', value: `${metrics.savingsRate}%`, color: metrics.savingsRate >= 20 ? 'text-emerald-400' : metrics.savingsRate >= 10 ? 'text-amber-400' : 'text-rose-400', bg: metrics.savingsRate >= 20 ? 'bg-emerald-500/10' : metrics.savingsRate >= 10 ? 'bg-amber-500/10' : 'bg-rose-500/10', border: metrics.savingsRate >= 20 ? 'border-emerald-500/20' : metrics.savingsRate >= 10 ? 'border-amber-500/20' : 'border-rose-500/20' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                className={`glass-card rounded-2xl border ${stat.border} ${stat.bg} p-3 md:p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-sm md:text-lg font-bold font-space ${stat.color} truncate`}>{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl border border-border mb-4 md:mb-6 overflow-x-auto scrollbar-none">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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
                    className="glass-card rounded-2xl border border-border p-4 md:p-5">
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
          {activeTab === 'analyst' && (
            <motion.div
              key="analyst"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col"
              style={{ height: '60vh', minHeight: 380 }}
            >
              <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                {messages.filter(m => m.role === 'user' || (m.role === 'assistant' && m.content)).length === 0 && (
                  <div className="glass-card rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                    <Brain className="w-10 h-10 text-gold mx-auto mb-3" />
                    <p className="text-base font-space font-bold text-foreground mb-2">FINOVA Analyst</p>
                    <p className="text-sm text-muted-foreground mb-4">Ask me anything about your finances, score, or how to improve.</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Explain my score', 'What should I fix first?', 'Am I ready to invest?', 'How to save more?'].map(q => (
                        <button key={q} onClick={() => setChatInput(q)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.filter(m => m.role === 'user' || (m.role === 'assistant' && m.content)).map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Cpu className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary/15 border border-primary/20 text-foreground' : 'glass-card border border-border text-foreground'}`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{msg.content}</ReactMarkdown>
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <div className="glass-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                      <span className="text-xs text-muted-foreground">Analyzing...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
                  placeholder="Ask about your finances…"
                  className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
                <button onClick={handleChatSend} disabled={!chatInput.trim() || sending}
                  className="gold-gradient text-primary-foreground px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 disabled:opacity-40 transition-opacity">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <MobileNav />
    </div>
  );
}