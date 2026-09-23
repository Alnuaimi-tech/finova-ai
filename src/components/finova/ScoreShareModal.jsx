import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Download, Link2, Check, Loader2, Twitter, MessageCircle, Facebook } from 'lucide-react';
import html2canvas from 'html2canvas';
import LogoMark from '@/components/finova/LogoMark';

const APP_URL = 'https://finova-ai.base44.app';

const RISK_STYLE = {
  'Low Risk': { ring: '#34d399', text: '#34d399', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.45)' },
  'Medium Risk': { ring: '#fbbf24', text: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.45)' },
  'High Risk': { ring: '#fb7185', text: '#fb7185', bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.45)' },
};

export default function ScoreShareModal({ open, onClose, score, riskLevel }) {
  const badgeRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const rs = RISK_STYLE[riskLevel] || RISK_STYLE['Medium Risk'];
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const R = 52, C = 2 * Math.PI * R, offset = C * (1 - safeScore / 100);

  const shareText = `My FINOVA Financial Health Score is ${safeScore}/100 — ${riskLevel}! 🎯 Find out yours at`;
  const shareUrl = `${shareText} ${APP_URL}`;
  const enc = encodeURIComponent(shareUrl);
  const encUrl = encodeURIComponent(APP_URL);

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const renderImage = async () => {
    if (!badgeRef.current) return null;
    return html2canvas(badgeRef.current, { backgroundColor: '#0a0f1f', scale: 2, useCORS: true, logging: false });
  };

  const handleNativeShare = async () => {
    setBusy(true);
    try {
      let payload = { title: 'My FINOVA Score', text: shareUrl, url: APP_URL };
      if (navigator.canShare) {
        try {
          const canvas = await renderImage();
          if (canvas) {
            const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
            const file = new File([blob], 'finova-score.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              payload = { files: [file], title: 'My FINOVA Score', text: shareUrl };
            }
          }
        } catch { /* ignore image issues, fall back to text share */ }
      }
      await navigator.share(payload);
    } catch { /* user cancelled or unsupported */ } finally { setBusy(false); }
  };

  const handleDownload = async () => {
    setBusy(true);
    try {
      const canvas = await renderImage();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'finova-score.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { } finally { setBusy(false); }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="glass-card rounded-2xl border border-border w-full max-w-md p-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-space font-bold text-foreground">Share Your Score</h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge preview */}
            <div className="flex justify-center mb-5">
              <div
                ref={badgeRef}
                style={{
                  width: 340,
                  background: 'linear-gradient(160deg, #0a0f1f 0%, #131a2e 60%, #1a2238 100%)',
                  borderRadius: 24,
                  padding: 28,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <LogoMark size={32} />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#f5c441', letterSpacing: '-0.02em' }}>
                    FINOVA AI
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: '#7d8aa3', border: '1px solid #2a3450', borderRadius: 999, padding: '2px 8px' }}>
                    UAE 🇦🇪
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#7d8aa3', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center', marginBottom: 12 }}>
                  My Financial Health Score
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                  <svg viewBox="0 0 120 120" width="150" height="150">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="#1c2438" strokeWidth="10" />
                    <circle cx="60" cy="60" r={R} fill="none" stroke={rs.ring} strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} transform="rotate(-90 60 60)" />
                    <text x="60" y="66" textAnchor="middle" fontSize="36" fontWeight="800" fill="#ffffff" fontFamily="Space Grotesk, sans-serif">{safeScore}</text>
                    <text x="60" y="84" textAnchor="middle" fontSize="12" fill="#7d8aa3" fontFamily="Inter, sans-serif">/ 100</text>
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999, background: rs.bg, color: rs.text, border: `1px solid ${rs.border}` }}>
                    {riskLevel}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #2a3450', paddingTop: 14, textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: '#7d8aa3', marginBottom: 4 }}>Track your money. Grow your future.</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#f5c441', fontFamily: 'Space Grotesk, sans-serif' }}>finova-ai.base44.app</p>
                </div>
              </div>
            </div>

            {/* Native share (mobile / supporting browsers) */}
            {hasNativeShare && (
              <button
                onClick={handleNativeShare} disabled={busy}
                className="w-full gold-gradient text-primary-foreground font-semibold text-sm rounded-xl py-3 flex items-center justify-center gap-2 mb-3 disabled:opacity-60"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                {busy ? 'Preparing…' : 'Share Badge'}
              </button>
            )}

            {/* Social row */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <a href={`https://twitter.com/intent/tweet?text=${enc}&url=${encUrl}`} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/40 transition-colors">
                <Twitter className="w-4 h-4 text-foreground" />
                <span className="text-[10px] text-muted-foreground">X</span>
              </a>
              <a href={`https://wa.me/?text=${enc}`} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/40 transition-colors">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-muted-foreground">WhatsApp</span>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encUrl}&quote=${enc}`} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/40 transition-colors">
                <Facebook className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] text-muted-foreground">Facebook</span>
              </a>
              <button onClick={handleCopy}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-border bg-secondary/30 hover:border-primary/40 transition-colors">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4 text-foreground" />}
                <span className="text-[10px] text-muted-foreground">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Download image */}
            <button onClick={handleDownload} disabled={busy}
              className="w-full border border-border text-sm text-foreground hover:bg-secondary/40 rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              <Download className="w-4 h-4" />
              Download Badge Image
            </button>

            <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
              Your badge shows your score and risk level only — no income or spending details are shared.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}