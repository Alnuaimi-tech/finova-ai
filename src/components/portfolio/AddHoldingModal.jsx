import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const UAE_STOCKS_LIST = [
  { ticker: 'ADNOCDIST', name: 'ADNOC Distribution', exchange: 'ADX', emoji: '⛽', sector: 'Energy', basePrice: 3.82 },
  { ticker: 'ADNOCGAS', name: 'ADNOC Gas', exchange: 'ADX', emoji: '🔵', sector: 'Energy', basePrice: 3.21 },
  { ticker: 'EMIRATESNBD', name: 'Emirates NBD', exchange: 'DFM', emoji: '🏦', sector: 'Banking', basePrice: 17.20 },
  { ticker: 'FAB', name: 'First Abu Dhabi Bank', exchange: 'ADX', emoji: '🏦', sector: 'Banking', basePrice: 13.50 },
  { ticker: 'EMAAR', name: 'Emaar Properties', exchange: 'DFM', emoji: '🏙️', sector: 'Real Estate', basePrice: 7.85 },
  { ticker: 'ETISALAT', name: 'e& (Etisalat)', exchange: 'ADX', emoji: '📱', sector: 'Telecom', basePrice: 22.40 },
  { ticker: 'DPWORLD', name: 'DP World', exchange: 'DFM', emoji: '🚢', sector: 'Logistics', basePrice: 18.60 },
  { ticker: 'ALDAR', name: 'Aldar Properties', exchange: 'ADX', emoji: '🏗️', sector: 'Real Estate', basePrice: 5.34 },
  { ticker: 'DIB', name: 'Dubai Islamic Bank', exchange: 'DFM', emoji: '🕌', sector: 'Banking', basePrice: 6.10 },
];

export default function AddHoldingModal({ onClose, onAdd }) {
  const [selected, setSelected] = useState(UAE_STOCKS_LIST[0]);
  const [quantity, setQuantity] = useState('10');
  const [purchasePrice, setPurchasePrice] = useState(UAE_STOCKS_LIST[0].basePrice.toString());

  const handleStockChange = (ticker) => {
    const stock = UAE_STOCKS_LIST.find(s => s.ticker === ticker);
    setSelected(stock);
    setPurchasePrice(stock.basePrice.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ticker: selected.ticker,
      name: selected.name,
      exchange: selected.exchange,
      emoji: selected.emoji,
      sector: selected.sector,
      quantity: parseFloat(quantity),
      purchase_price: parseFloat(purchasePrice),
      purchase_date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card rounded-2xl border border-border p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold font-space text-foreground">Add Virtual Holding</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-2">Select Stock</label>
              <select
                value={selected.ticker}
                onChange={e => handleStockChange(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {UAE_STOCKS_LIST.map(s => (
                  <option key={s.ticker} value={s.ticker}>{s.emoji} {s.name} ({s.exchange})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-2">Quantity (Shares)</label>
                <input
                  type="number" min="1" value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-2">Buy Price (AED)</label>
                <input
                  type="number" step="0.01" min="0.01" value={purchasePrice}
                  onChange={e => setPurchasePrice(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
              <p className="text-xs text-muted-foreground">Total Investment</p>
              <p className="text-lg font-bold text-gold font-space">
                AED {(parseFloat(quantity || 0) * parseFloat(purchasePrice || 0)).toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              className="w-full gold-gradient text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add to Portfolio
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}