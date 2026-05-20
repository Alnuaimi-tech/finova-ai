import { motion } from 'framer-motion';
import MarketHeader from '../components/market/MarketHeader';
import MarketOverview from '../components/market/MarketOverview';
import CandlestickChart from '../components/market/CandlestickChart';
import TrendingStocks from '../components/market/TrendingStocks';
import PortfolioTracker from '../components/market/PortfolioTracker';
import AIInsights from '../components/market/AIInsights';
import WatchlistCrypto from '../components/market/WatchlistCrypto';
import AIChat from '../components/market/AIChat';

export default function MarketDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <MarketHeader />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Market Overview Bar */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <MarketOverview />
        </motion.div>

        {/* Main grid: Chart + AI Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CandlestickChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <AIChat />
          </motion.div>
        </div>

        {/* Second row: Trending + Portfolio + Watchlist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <TrendingStocks />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <PortfolioTracker />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <WatchlistCrypto />
          </motion.div>
        </div>

        {/* AI Insights full width */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <AIInsights />
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          ⚠️ All prices are <strong className="text-foreground">simulated for educational purposes</strong>. FINOVA AI is not a trading platform. For real market data visit <a href="https://www.adx.ae" target="_blank" rel="noopener noreferrer" className="underline text-primary">adx.ae</a> or <a href="https://www.dfm.ae" target="_blank" rel="noopener noreferrer" className="underline text-primary">dfm.ae</a>.
        </p>
      </div>
    </div>
  );
}