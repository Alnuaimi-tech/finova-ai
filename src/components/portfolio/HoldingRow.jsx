import { motion } from 'framer-motion';
import { Trash2, Pencil } from 'lucide-react';
import TradingViewMiniChart from '@/components/market/TradingViewMiniChart';

export default function HoldingRow({ holding, currentPrice, onDelete, onEdit, index }) {
  const invested = holding.purchase_price * holding.quantity;
  const hasPrice = Number.isFinite(currentPrice);
  const currentValue = hasPrice ? currentPrice * holding.quantity : null;
  const pnl = currentValue - invested;
  const pnlPct = ((pnl / invested) * 100).toFixed(2);
  const isUp = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl border border-border p-3 md:p-4 hover:border-white/10 transition-all"
    >
      {/* Mobile: stacked layout */}
      <div className="flex items-center gap-3">
        <span className="text-xl md:text-2xl flex-shrink-0">{holding.emoji || '📈'}</span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{holding.name}</p>
          <p className="text-xs text-muted-foreground">{holding.quantity} × AED {holding.purchase_price.toFixed(2)}</p>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">Value</p>
          <p className="text-sm font-bold text-foreground font-space">{hasPrice ? `AED ${currentValue.toFixed(2)}` : 'Price unavailable'}</p>
        </div>

        <div className="text-right flex-shrink-0">
          {hasPrice ? <>
            <p className={`text-xs font-bold ${isUp ? 'text-market-up' : 'text-market-down'}`}>{isUp ? '+' : ''}{pnlPct}%</p>
            <p className={`text-xs font-bold ${isUp ? 'text-market-up' : 'text-market-down'}`}>{isUp ? '+' : ''}AED {pnl.toFixed(2)}</p>
          </> : <p className="text-xs text-muted-foreground">Return unavailable</p>}
        </div>

        <button
          onClick={() => onEdit?.(holding)}
          className="ml-1 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(holding.id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-border/60">
        <TradingViewMiniChart symbol={`${holding.exchange}:${holding.ticker}`} height={160} />
      </div>
    </motion.div>
  );
}