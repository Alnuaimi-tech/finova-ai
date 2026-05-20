import { useState, useEffect, useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const STOCKS = ['ADNOC Dist.', 'Emirates NBD', 'Emaar', 'FAB', 'e& (Etisalat)', 'Apple', 'Tesla', 'BTC/USD'];

function seeded(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function generateCandles(base, vol, count = 40, seed = 99) {
  const r = seeded(seed);
  let close = base;
  return Array.from({ length: count }, (_, i) => {
    const open = close;
    const change = (r() - 0.48) * vol * open;
    close = Math.max(open * 0.7, open + change);
    const high = Math.max(open, close) * (1 + r() * vol * 0.5);
    const low = Math.min(open, close) * (1 - r() * vol * 0.5);
    const label = i % 8 === 0 ? `D${i + 1}` : '';
    return { label, open: +open.toFixed(2), close: +close.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), bullish: close >= open };
  });
}

const STOCK_CONFIGS = {
  'ADNOC Dist.': { base: 3.82, vol: 0.008 },
  'Emirates NBD': { base: 17.2, vol: 0.007 },
  'Emaar': { base: 7.85, vol: 0.012 },
  'FAB': { base: 13.5, vol: 0.006 },
  'e& (Etisalat)': { base: 22.4, vol: 0.005 },
  'Apple': { base: 188.4, vol: 0.009 },
  'Tesla': { base: 242.1, vol: 0.018 },
  'BTC/USD': { base: 67420, vol: 0.015 },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="glass-card rounded-xl border border-border px-3 py-2.5 text-xs space-y-1">
      <p className={`font-bold ${d.bullish ? 'text-emerald-400' : 'text-rose-400'}`}>{d.bullish ? '▲ Bullish' : '▼ Bearish'}</p>
      <p className="text-muted-foreground">Open: <span className="text-foreground font-semibold">{d.open}</span></p>
      <p className="text-muted-foreground">Close: <span className="text-foreground font-semibold">{d.close}</span></p>
      <p className="text-muted-foreground">High: <span className="text-emerald-400 font-semibold">{d.high}</span></p>
      <p className="text-muted-foreground">Low: <span className="text-rose-400 font-semibold">{d.low}</span></p>
    </div>
  );
};

export default function CandlestickChart() {
  const [selected, setSelected] = useState('ADNOC Dist.');
  const [candles, setCandles] = useState([]);

  const cfg = STOCK_CONFIGS[selected];

  useEffect(() => {
    setCandles(generateCandles(cfg.base, cfg.vol, 40, selected.length * 17));
  }, [selected]);

  useEffect(() => {
    const id = setInterval(() => {
      setCandles(prev => {
        if (!prev.length) return prev;
        const last = prev[prev.length - 1];
        const open = last.close;
        const change = (Math.random() - 0.48) * cfg.vol * open;
        const close = Math.max(open * 0.7, open + change);
        const high = Math.max(open, close) * (1 + Math.random() * cfg.vol * 0.4);
        const low = Math.min(open, close) * (1 - Math.random() * cfg.vol * 0.4);
        const newCandle = { label: '', open: +open.toFixed(2), close: +close.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), bullish: close >= open };
        return [...prev.slice(1), newCandle];
      });
    }, 3000);
    return () => clearInterval(id);
  }, [cfg]);

  const lastCandle = candles[candles.length - 1];
  const firstClose = candles[0]?.close;
  const totalChange = lastCandle && firstClose ? (((lastCandle.close - firstClose) / firstClose) * 100).toFixed(2) : '0.00';
  const up = parseFloat(totalChange) >= 0;

  // For recharts: bar bottom = min(open,close), bar size = |close-open|
  const chartData = candles.map(c => ({
    ...c,
    barLow: Math.min(c.open, c.close),
    barSize: Math.abs(c.close - c.open) || 0.001,
  }));

  return (
    <div className="glass-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Live Chart</p>
          <div className="flex items-center gap-3">
            <p className="text-xl font-space font-bold text-foreground">{selected}</p>
            {lastCandle && (
              <div className={`flex items-center gap-1.5 text-sm font-bold px-2.5 py-1 rounded-full ${up ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                {up ? '▲' : '▼'} {up ? '+' : ''}{totalChange}%
              </div>
            )}
            {lastCandle && (
              <p className="text-lg font-bold font-space text-foreground">{lastCandle.close}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STOCKS.map(s => (
            <button key={s} onClick={() => setSelected(s)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-medium ${selected === s ? 'gold-gradient text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:text-foreground hover:border-white/10'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={42}
            tickFormatter={v => v > 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />} />
          {/* Wick lines via Line on high/low */}
          <Bar dataKey="barSize" stackId="candle" fill="transparent" radius={0}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.bullish ? '#10b981' : '#f43f5e'} />
            ))}
          </Bar>
          <Line type="monotone" dataKey="high" stroke="transparent" dot={false} activeDot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center mt-2">Simulated price data · Updates every 3s · For educational use only</p>
    </div>
  );
}