import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

function buildGrowthData(holdings, currentPrices) {
  if (!holdings.length) return [];
  // Simulate 30 days of growth for each holding
  const days = 30;
  const points = Array.from({ length: days + 1 }, (_, i) => {
    const label = i === 0 ? 'Purchase' : `Day ${i}`;
    let value = 0;
    holdings.forEach(h => {
      const current = currentPrices[h.ticker] || h.purchase_price;
      // Linear interpolation with slight curve from purchase_price -> current
      const progress = i / days;
      const eased = progress * progress * (3 - 2 * progress); // smooth step
      const noise = 1 + (Math.sin(i * 2.3 + h.ticker.charCodeAt(0)) * 0.012);
      const price = h.purchase_price + (current - h.purchase_price) * eased * noise;
      value += price * h.quantity;
    });
    return { label, value: parseFloat(value.toFixed(2)) };
  });
  return points;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-bold text-gold">AED {payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

export default function PortfolioGrowthChart({ holdings, currentPrices }) {
  const data = useMemo(() => buildGrowthData(holdings, currentPrices), [holdings, currentPrices]);
  const isUp = data.length > 1 && data[data.length - 1].value >= data[0].value;

  if (!data.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-border p-5"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">
        Portfolio Growth — Last 30 Days (Simulated)
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0.25} />
              <stop offset="95%" stopColor={isUp ? '#10b981' : '#f43f5e'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
            interval={Math.max(1, Math.floor(data.length / 6) - 1)} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke={isUp ? '#10b981' : '#f43f5e'}
            strokeWidth={2} fill="url(#portfolioGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}