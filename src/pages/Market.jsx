import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, TrendingUp, BarChart3, PiggyBank, Plus, TrendingDown } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import BrandLogo from '../components/finova/BrandLogo';
import LiveMarketOverview from '../components/market/LiveMarketOverview';
import UAEStocksPanel from '../components/finova/UAEStocksPanel';
import PortfolioSummaryCard from '../components/portfolio/PortfolioSummaryCard';
import PortfolioGrowthChart from '../components/portfolio/PortfolioGrowthChart';
import HoldingRow from '../components/portfolio/HoldingRow';
import AddHoldingModal from '../components/portfolio/AddHoldingModal';
import EditHoldingModal from '../components/portfolio/EditHoldingModal';
import { base44 } from '@/api/base44Client';
import useMarketData from '@/components/market/useMarketData';
import MarketDataStatus from '@/components/market/MarketDataStatus';
import MarketTicker from '@/components/market/MarketTicker';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'uae', label: 'UAE Stocks', icon: TrendingUp },
  { id: 'portfolio', label: 'My Portfolio', icon: PiggyBank },
];

export default function Market() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Portfolio state
  const [holdings, setHoldings] = useState([]);
  const market = useMarketData();
  const currentPrices = Object.fromEntries(Object.values(market.quotes).filter(q => q.exchange === 'ADX' || q.exchange === 'DFM').map(q => [q.symbol, q.price]));
  const allPriced = holdings.every(h => Number.isFinite(currentPrices[h.ticker]));
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHoldings = useCallback(async () => {
    const data = await base44.entities.VirtualHolding.list();
    setHoldings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'portfolio') fetchHoldings();
  }, [activeTab, fetchHoldings]);

  const handleAdd = async (data) => {
    await base44.entities.VirtualHolding.create(data);
    fetchHoldings();
  };

  const handleDelete = async (id) => {
    await base44.entities.VirtualHolding.delete(id);
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const handleEditSubmit = async (id, data) => {
    await base44.entities.VirtualHolding.update(id, data);
    fetchHoldings();
  };

  const totalInvested = holdings.reduce((s, h) => s + h.purchase_price * h.quantity, 0);
  const totalCurrentValue = allPriced ? holdings.reduce((s, h) => s + currentPrices[h.ticker] * h.quantity, 0) : null;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="font-space font-bold text-base text-foreground tracking-tight">Market</span>
          </div>
          {activeTab === 'portfolio' && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg px-3 py-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Stock
            </button>
          )}
        </div>
      </header>

      <MarketTicker quotes={market.quotes} />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-5">
        <MarketDataStatus market={market} />
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl border border-border mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <LiveMarketOverview market={market} />
            </motion.div>
          )}

          {/* ── UAE STOCKS ── */}
          {activeTab === 'uae' && (
            <motion.div key="uae" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <UAEStocksPanel quotes={market.quotes} issues={market.issues} />
            </motion.div>
          )}

          {/* ── PORTFOLIO ── */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <div className="glass-card rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold text-foreground font-space mb-1">Virtual Portfolio</p>
                <p className="text-xs text-muted-foreground">Practice investing with real market quotes where available — no real money. Missing prices are never estimated; cached quotes may be outdated.</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
                </div>
              ) : holdings.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl border border-border p-12 text-center">
                  <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-base font-semibold text-foreground mb-2 font-space">No holdings yet</p>
                  <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">Add your first virtual stock to start tracking your portfolio.</p>
                  <button onClick={() => setShowModal(true)}
                    className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Stock
                  </button>
                </motion.div>
              ) : (
                <>
                  {allPriced ? <>
                    <PortfolioSummaryCard totalInvested={totalInvested} totalCurrentValue={totalCurrentValue} />
                    <PortfolioGrowthChart holdings={holdings} currentPrices={currentPrices} />
                  </> : <p className="text-sm text-muted-foreground">Invested: AED {totalInvested.toLocaleString()} · Current portfolio value and return are unavailable until every holding has a quote.</p>}
                  <div className="space-y-2">
                    {holdings.map((h, i) => (
                      <HoldingRow key={h.id} holding={h} currentPrice={currentPrices[h.ticker]} onDelete={handleDelete} onEdit={setEditTarget} index={i} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Virtual holdings for education only. Quotes are the latest retrieved values, not guaranteed real-time prices.</p>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {showModal && <AddHoldingModal onClose={() => setShowModal(false)} onAdd={handleAdd} currentPrices={currentPrices} />}
      {editTarget && <EditHoldingModal holding={editTarget} onClose={() => setEditTarget(null)} onSubmit={handleEditSubmit} />}
      <MobileNav />
    </div>
  );
}