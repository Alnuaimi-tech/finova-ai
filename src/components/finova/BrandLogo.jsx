import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export default function BrandLogo({ size = 'sm', showWordmark = false, showBadge = false }) {
  const dim = size === 'lg' ? 'w-9 h-9 rounded-xl' : 'w-8 h-8 rounded-lg';
  return (
    <Link to="/" aria-label="FINOVA AI — Home" className="flex items-center gap-2.5 group cursor-pointer">
      <div className={`${dim} gold-gradient flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0`}>
        <Cpu className="w-4 h-4 text-primary-foreground" />
      </div>
      {showWordmark && (
        <span className="font-space font-bold text-base text-foreground tracking-tight">FINOVA AI</span>
      )}
      {showBadge && (
        <span className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-1">UAE 🇦🇪</span>
      )}
    </Link>
  );
}