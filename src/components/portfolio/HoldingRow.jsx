import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

export default function HoldingRow({ holding, currentPrice, onDelete, index }) {
  const invested = holding.purchase_price * holding.quantity;
  const currentValue = currentPrice * holding.quantity;
  const pnl = currentValue - invested;
  const pnlPct = ((pnl / invested) * 100).toFixed(2);
  const isUp = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl border border-border p-4 flex items-center gap-3 hover:border-white/10 transition-all"
    >
      <span className="text-2xl flex-shrink-0">{holding.emoji || '📈'}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{holding.name}</p>
        <p className="text-xs text-muted-foreground">{holding.quantity} shares @ AED {holding.purchase_price.toFixed(2)}</p>
      </div>

      <div className="text-right hidden sm:block">
        <p className="text-xs text-muted-foreground">Current</p>
        <p className="text-sm font-bold text-foreground font-space">AED {currentPrice.toFixed(2)}</p>
      </div>

      <div className="text-right hidden sm:block">
        <p className="text-xs text-muted-foreground">Value</p>
        <p className="text-sm font-bold text-foreground font-space">AED {currentValue.toFixed(2)}</p>
      </div>

      <div className={`text-right flex-shrink-0`}>
        <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? '+' : ''}{pnlPct}%
        </div>
        <p className={`text-sm font-bold font-space ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isUp ? '+' : ''}AED {pnl.toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => onDelete(holding.id)}
        className="ml-1 p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all flex-shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}