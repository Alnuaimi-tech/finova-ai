import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

export default function EditHoldingModal({ holding, onClose, onSubmit }) {
  const [quantity, setQuantity] = useState(String(holding.quantity));
  const [purchasePrice, setPurchasePrice] = useState(String(holding.purchase_price));
  const [purchaseDate, setPurchaseDate] = useState(holding.purchase_date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(holding.id, {
      quantity: parseFloat(quantity),
      purchase_price: parseFloat(purchasePrice),
      purchase_date: purchaseDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card rounded-2xl border border-border p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{holding.emoji || '📈'}</span>
            <h2 className="text-base font-bold font-space text-foreground">Edit Holding</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-xl bg-secondary/40 border border-border px-4 py-3 mb-4">
          <p className="text-sm font-semibold text-foreground">{holding.name}</p>
          <p className="text-xs text-muted-foreground">{holding.ticker} · {holding.exchange} · {holding.sector}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-2">Purchase Date</label>
            <input
              type="date" value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="text-lg font-bold text-gold font-space">
              AED {(parseFloat(quantity || 0) * parseFloat(purchasePrice || 0)).toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            className="w-full gold-gradient text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}