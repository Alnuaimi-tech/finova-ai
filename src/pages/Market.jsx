import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, TrendingUp, BarChart3, PiggyBank, Plus, TrendingDown } from 'lucide-react';
import MobileNav from '../components/finova/MobileNav';
import LiveMarketOverview from '../components/market/LiveMarketOverview';
import UAEStocksPanel from '../components/finova/UAEStocksPanel';
import PortfolioSummaryCard from '../components/portfolio/PortfolioSummaryCard';
import PortfolioGrowthChart from '../components/portfolio/PortfolioGrowthChart';
import HoldingRow from '../components/portfolio/HoldingRow';
import AddHoldingModal from '../components/portfolio/AddHoldingModal';
import { base44 } from '@/api/base44Client';

const BASE_PRICES = {
  ADNOCDIST: 3.82, ADNOCGAS: 3.21, EMIRATESNBD: 17.20, FAB: 13.50,
  EMAAR: 7.85, ETISALAT: 22.40, DPWORLD: 18.60, ALDAR: 5.34, DIB: 6.10,
};

function getSimPrice(ticker) {
  const base = BASE_PRICES[ticker] || 10;
  return parseFloat((base * (1 + Math.sin(Date.now() / 10000 + ticker.charCodeAt(0)) * 0.03)).toFixed(3));
}

const TICKER_STOCKS = [
  { symbol: 'EMAAR', price: 7.85, change: 1.2 },
  { symbol: 'FAB', price: 13.50, change: -0.4 },
  { symbol: 'ETISALAT', price: 22.40, change: 2.1 },
  { symbol: 'ADNOCGAS', price: 3.21, change: 0.8 },
  { symbol: 'EMIRATESNBD', price: 17.20, change: -1.1 },
  { symbol: 'ALDAR', price: 5.34, change: 1.5 },
  { symbol: 'DIB', price: 6.10, change: -0.6 },
  { symbol: 'DPWORLD', price: 18.60, change: 0.3 },
  { symbol: 'ADNOCDIST', price: 3.82, change: 1.9 },
];

function TickerTape() {
  const [tickers, setTickers] = useState(TICKER_STOCKS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => ({
        ...t,
        price: parseFloat((t.price * (1 + (Math.random() - 0.49) * 0.006)).toFixed(3)),
        change: parseFloat((t.change + (Math.random() - 0.5) * 0.1).toFixed(2)),
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const items = [...tickers, ...tickers];

  return (
    <div className="border-b border-border/40 bg-secondary/20 overflow-hidden py-2">
      <div className="flex animate-marquee gap-8 w-max">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span className="font-semibold text-foreground font-space">{t.symbol}</span>
            <span className="text-muted-foreground">AED {t.price.toFixed(2)}</span>
            <span className={`flex items-center gap-0.5 font-medium ${t.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {t.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {t.change >= 0 ? '+' : ''}{t.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const [currentPrices, setCurrentPrices] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHoldings = useCallback(async () => {
    const data = await base44.entities.VirtualHolding.list();
    setHoldings(data);
    setLoading(false);
  }, []);

  const refreshPrices = useCallback(() => {
    const prices = {};
    Object.keys(BASE_PRICES).forEach(t => { prices[t] = getSimPrice(t); });
    setCurrentPrices(prices);
  }, []);

  useEffect(() => {
    if (activeTab === 'portfolio') {
      fetchHoldings();
      refreshPrices();
      const interval = setInterval(refreshPrices, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchHoldings, refreshPrices]);

  const handleAdd = async (data) => {
    await base44.entities.VirtualHolding.create(data);
    fetchHoldings();
  };

  const handleDelete = async (id) => {
    await base44.entities.VirtualHolding.delete(id);
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const totalInvested = holdings.reduce((s, h) => s + h.purchase_price * h.quantity, 0);
  const totalCurrentValue = holdings.reduce((s, h) => s + (currentPrices[h.ticker] || h.purchase_price) * h.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 px-4 md:px-6 py-3 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
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

      <TickerTape />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-5">
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
              <LiveMarketOverview />
            </motion.div>
          )}

          {/* ── UAE STOCKS ── */}
          {activeTab === 'uae' && (
            <motion.div key="uae" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <UAEStocksPanel />
            </motion.div>
          )}

          {/* ── PORTFOLIO ── */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-5">
              <div className="glass-card rounded-2xl border border-border p-4">
                <p className="text-sm font-semibold text-foreground font-space mb-1">Virtual Portfolio</p>
                <p className="text-xs text-muted-foreground">Practice investing with simulated prices — zero real money, 100% real learning.</p>
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
                  <PortfolioSummaryCard totalInvested={totalInvested} totalCurrentValue={totalCurrentValue} />
                  <PortfolioGrowthChart holdings={holdings} currentPrices={currentPrices} />
                  <div className="space-y-2">
                    {holdings.map((h, i) => (
                      <HoldingRow key={h.id} holding={h} currentPrice={currentPrices[h.ticker] || h.purchase_price} onDelete={handleDelete} index={i} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">⚠️ Simulated for education only. Not a real investment platform.</p>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {showModal && <AddHoldingModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      <MobileNav />
    </div>
  );
}