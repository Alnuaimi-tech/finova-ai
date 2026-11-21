import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';

export default function SiteFooter() {
  const { t } = useLanguage();
  const c = t.common;
  return (
    <footer className="border-t border-border/50 mt-10 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link to="/about" className="hover:text-foreground transition-colors">{c.about}</Link>
        <span className="text-border">·</span>
        <Link to="/contact" className="hover:text-foreground transition-colors">{c.contact}</Link>
        <span className="text-border">·</span>
        <Link to="/terms" className="hover:text-foreground transition-colors">{c.terms}</Link>
        <span className="text-border">·</span>
        <Link to="/privacy" className="hover:text-foreground transition-colors">{c.privacy}</Link>
      </div>
      <p className="text-center text-[11px] text-muted-foreground/60 mt-3">© {new Date().getFullYear()} FINOVA AI · {c.disclaimerShort}</p>
      <p className="text-center text-[11px] text-muted-foreground/60 mt-1">
        <a href="mailto:finovaai.uae@gmail.com" className="hover:text-muted-foreground transition-colors">finovaai.uae@gmail.com</a>
      </p>
    </footer>
  );
}