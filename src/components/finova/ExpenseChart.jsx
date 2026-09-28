import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/lib/LanguageContext';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

const CustomTooltip = ({ active, payload, pctOfIncome }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-white/10">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-gold font-bold">AED {payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{pctOfIncome ? pctOfIncome(payload[0].payload.pct) : `${payload[0].payload.pct}% of income`}</p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ data, income }) {
  const { t } = useLanguage();
  const cats = t.dash.expenseCats;
  const chartData = [
    { name: cats.rent, value: data.rent || 0 },
    { name: cats.food, value: data.food || 0 },
    { name: cats.transport, value: data.transport || 0 },
    { name: cats.shopping, value: data.shopping || 0 },
    { name: cats.other, value: data.other || 0 },
  ]
    .filter(d => d.value > 0)
    .map(d => ({
      ...d,
      pct: income > 0 ? ((d.value / income) * 100).toFixed(1) : 0,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        {t.dash.noExpenseData}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip pctOfIncome={t.dash.pctOfIncome} />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}