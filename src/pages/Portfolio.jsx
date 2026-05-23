import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ArrowLeft, Plus, PiggyBank, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PortfolioSummaryCard from '../components/portfolio/PortfolioSummaryCard';
import PortfolioGrowthChart from '../components/portfolio/PortfolioGrowthChart';
import HoldingRow from '../components/portfolio/HoldingRow';
import AddHoldingModal from '../components/portfolio/AddHoldingModal';

// Simulated current prices (same base prices as UAEStocksPanel, with slight drift)
const BASE_PRICES = {
  ADNOCDIST: 3.82, ADNOCGAS: 3.21, EMIRATESNBD: 17.20, FAB: 13.50,
  EMAAR: 7.85, ETISALAT: 22.40, DPWORLD: 18.60, ALDAR: 5.34, DIB: 6.10,
};

function getSimulatedPrice(ticker) {
  const base = BASE_PRICES[ticker] || 10;
  const drift = 1 + (Math.sin(Date.now() / 10000 + ticker.charCodeAt(0)) * 0.03);
  return parseFloat((base * drift).toFixed(3));
}

export default function Portfolio() {
  const navigate = useNavigate();
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
    Object.keys(BASE_PRICES).forEach(ticker => {
      prices[ticker] = getSimulatedPrice(ticker);
    });
    setCurrentPrices(prices);
  }, []);

  useEffect(() => {
    fetchHoldings();
    refreshPrices();
    const interval = setInterval(refreshPrices, 4000);
    return () => clearInterval(interval);
  }, [fetchHoldings, refreshPrices]);

  const handleAdd = async (holdingData) => {
    await base44.entities.VirtualHolding.create(holdingData);
    fetchHoldings();
  };

  const handleDelete = async (id) => {
    await base44.entities.VirtualHolding.delete(id);
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const totalInvested = holdings.reduce((sum, h) => sum + h.purchase_price * h.quantity, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => {
    const price = currentPrices[h.ticker] || h.purchase_price;
    return sum + price * h.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-space font-bold text-lg text-foreground tracking-tight">FINOVA AI</span>
            <span className="text-muted-foreground text-sm ml-1">/ Virtual Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg px-3 py-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Holding
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
            <PiggyBank className="w-3 h-3" />
            Virtual Portfolio Tracker
          </div>
          <h1 className="text-3xl font-space font-bold text-foreground mb-1">My UAE Stock Portfolio</h1>
          <p className="text-sm text-muted-foreground">Practice investing with simulated prices — zero real money, 100% real learning.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : holdings.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-border p-12 text-center"
          >
            <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base font-semibold text-foreground mb-2 font-space">No holdings yet</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">Add your first virtual stock to start tracking your simulated portfolio performance.</p>
            <button
              onClick={() => setShowModal(true)}
              className="gold-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Your First Holding
            </button>
          </motion.div>
        ) : (
          <>
            {/* Summary Cards */}
            <PortfolioSummaryCard totalInvested={totalInvested} totalCurrentValue={totalCurrentValue} />

            {/* Growth Chart */}
            <PortfolioGrowthChart holdings={holdings} currentPrices={currentPrices} />

            {/* Holdings List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  Holdings ({holdings.length})
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Live simulation
                </div>
              </div>
              <div className="space-y-2">
                {holdings.map((h, i) => (
                  <HoldingRow
                    key={h.id}
                    holding={h}
                    currentPrice={currentPrices[h.ticker] || h.purchase_price}
                    onDelete={handleDelete}
                    index={i}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pb-4">
              ⚠️ All prices are simulated for educational purposes only. This is not a real investment platform.
            </p>
          </>
        )}
      </div>

      {showModal && (
        <AddHoldingModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}