import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-white/10 text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-gold font-bold">AED {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function PredictionCard({ predictions, narrative, currentSavings, riskTrend }) {
  const chartData = [
    { month: 'Now', savings: currentSavings || 0 },
    ...predictions.map(p => ({
      month: `Month ${p.month}`,
      savings: p.projectedSavings,
    })),
  ];

  const trend = predictions[2]?.projectedSavings > (currentSavings || 0);
  const TrendIcon = predictions[2]?.projectedSavings === (currentSavings || 0) ? Minus :
    trend ? TrendingUp : TrendingDown;
  const trendColor = predictions[2]?.projectedSavings === (currentSavings || 0) ? 'text-slate-400' :
    trend ? 'text-emerald-400' : 'text-rose-400';

  const RiskTrendIcon = riskTrend?.label === 'Improving' ? ArrowUpRight : riskTrend?.label === 'Worsening' ? ArrowDownRight : ArrowRight;

  return (
    <div className="space-y-4">
      {riskTrend && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${riskTrend.bg}`}>
          <RiskTrendIcon className={`w-5 h-5 ${riskTrend.color}`} />
          <div>
            <p className={`text-sm font-bold ${riskTrend.color}`}>Risk Trend: {riskTrend.label}</p>
            <p className="text-xs text-muted-foreground">Based on current savings rate and expense ratio</p>
          </div>
        </div>
      )}
      <div className="glass-card rounded-xl border border-border p-4">
        <p className="text-sm text-foreground leading-relaxed font-medium">{narrative}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {predictions.map((p) => (
          <motion.div
            key={p.month}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: p.month * 0.1 }}
            className="glass-card rounded-xl border border-border p-3 text-center"
          >
            <p className="text-xs text-muted-foreground mb-1">Month {p.month}</p>
            <p className={`text-sm font-bold ${p.projectedSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              AED {p.projectedSavings.toLocaleString()}
            </p>
            <div className={`flex items-center justify-center gap-1 mt-1 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs">
                {p.surplus >= 0 ? '+' : ''}{p.surplus.toLocaleString()}/mo
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-xl border border-border p-4">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">Savings Trajectory</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trend ? '#10b981' : '#f43f5e'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={trend ? '#10b981' : '#f43f5e'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="savings"
              stroke={trend ? '#10b981' : '#f43f5e'}
              strokeWidth={2}
              fill="url(#savingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}