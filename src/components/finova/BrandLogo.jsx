import { Link } from 'react-router-dom';
import LogoMark from '@/components/finova/LogoMark';

export default function BrandLogo({ size = 'sm', showWordmark = false, showBadge = false }) {
  const px = size === 'lg' ? 36 : 32;
  return (
    <Link to="/" aria-label="FINOVA AI — Home" className="flex items-center gap-2.5 group cursor-pointer">
      <LogoMark size={px} className="group-hover:scale-105 transition-transform flex-shrink-0 shadow-lg" />
      {showWordmark && (
        <span className="font-space font-bold text-base text-foreground tracking-tight">FINOVA AI</span>
      )}
      {showBadge && (
        <span className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-1">UAE 🇦🇪</span>
      )}
    </Link>
  );
}