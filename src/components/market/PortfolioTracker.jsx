import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL_HOLDINGS = [
  { symbol: 'ADNOCDIST', name: 'ADNOC Dist.', emoji: '⛽', shares: 100, avgBuy: 3.50, current: 3.82, color: '#f5c441' },
  { symbol: 'EMAAR', name: 'Emaar', emoji: '🏙️', shares: 50, avgBuy: 8.10, current: 7.85, color: '#6366f1' },
  { symbol: 'FAB', name: 'First Abu Dhabi Bank', emoji: '🏦', shares: 30, avgBuy: 12.80, current: 13.50, color: '#10b981' },
  { symbol: 'BTC', name: 'Bitcoin', emoji: '₿', shares: 0.05, avgBuy: 60000, current: 67420, color: '#f97316' },
  { symbol: 'AAPL', name: 'Apple', emoji: '🍎', shares: 10, avgBuy: 175.0, current: 188.4, color: '#3b82f6' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl border border-border px-3 py-2 text-xs">
      <p className="font-bold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value.toFixed(1)}% of portfolio</p>
    </div>
  );
};

export default function PortfolioTracker() {
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);

  useEffect(() => {
    const id = setInterval(() => {
      setHoldings(prev => prev.map(h => ({
        ...h,
        current: parseFloat((h.current * (1 + (Math.random() - 0.499) * 0.002)).toFixed(h.current > 100 ? 2 : 3)),
      })));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.current, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgBuy, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = ((totalGain / totalCost) * 100).toFixed(2);
  const up = totalGain >= 0;

  const pieData = holdings.map(h => ({
    name: h.symbol,
    value: (h.shares * h.current / totalValue) * 100,
    color: h.color,
  }));

  return (
    <div className="glass-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          <p className="text-sm font-bold text-foreground">Practice Portfolio</p>
        </div>
        <span className="text-xs text-muted-foreground">Simulated AED</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-secondary/30 border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Value</p>
          <p className="text-sm font-bold font-space text-foreground">AED {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${up ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
          <p className="text-xs text-muted-foreground mb-1">Total Gain</p>
          <p className={`text-sm font-bold font-space ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
            {up ? '+' : ''}AED {Math.abs(totalGain).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${up ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
          <p className="text-xs text-muted-foreground mb-1">Return</p>
          <p className={`text-sm font-bold font-space flex items-center justify-center gap-1 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
            {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {up ? '+' : ''}{totalGainPct}%
          </p>
        </div>
      </div>

      {/* Pie + Holdings */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          {holdings.map((h, i) => {
            const val = h.shares * h.current;
            const gain = val - h.shares * h.avgBuy;
            const gainPct = ((gain / (h.shares * h.avgBuy)) * 100).toFixed(1);
            const pos = gain >= 0;
            return (
              <motion.div key={h.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: h.color }} />
                <span className="text-xs text-foreground font-medium truncate flex-1">{h.symbol}</span>
                <span className={`text-xs font-bold ${pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pos ? '+' : ''}{gainPct}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}