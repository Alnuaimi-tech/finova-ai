import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 border border-white/10">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-gold font-bold">AED {payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{payload[0].payload.pct}% of income</p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ data, income }) {
  const chartData = [
    { name: 'Rent', value: data.rent || 0 },
    { name: 'Food', value: data.food || 0 },
    { name: 'Transport', value: data.transport || 0 },
    { name: 'Shopping', value: data.shopping || 0 },
    { name: 'Other', value: data.other || 0 },
  ]
    .filter(d => d.value > 0)
    .map(d => ({
      ...d,
      pct: income > 0 ? ((d.value / income) * 100).toFixed(1) : 0,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No expense data to display
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
        <Tooltip content={<CustomTooltip />} />
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