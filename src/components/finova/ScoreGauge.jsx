import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function ScoreGauge({ score, riskLevel, riskColor }) {
  const { t } = useLanguage() || {};
  const riskText = (t && t.dash && t.dash.risk[riskLevel]) || riskLevel;
  const [displayScore, setDisplayScore] = useState(0);
  // The risk label only appears once the count-up finishes, so the gauge never
  // shows a misleading "0 / 100 Medium Risk" combination mid-animation.
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    let raf;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const circumference = 2 * Math.PI * 52;
  const strokeDash = (score / 100) * circumference * 0.75;
  const gap = circumference * 0.25;

  const getScoreColor = () => {
    if (score < 40) return '#f43f5e';
    if (score < 70) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[135deg] score-ring">
          {/* Background track */}
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={getScoreColor()}
            strokeWidth="8"
            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${strokeDash} ${circumference - strokeDash}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${getScoreColor()})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-6xl font-bold font-space tabular-nums"
            style={{ color: getScoreColor() }}
            aria-label={`${score} / 100, ${riskText}`}
          >
            {displayScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Risk badge — only after the count-up animation completes */}
      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold border ${riskColor.bg} ${riskColor.border} ${riskColor.text}`}
        >
          {riskText}
        </motion.div>
      )}
    </div>
  );
}