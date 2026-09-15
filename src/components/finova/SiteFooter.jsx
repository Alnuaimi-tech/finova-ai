import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/50 mt-10 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        <span className="text-border">·</span>
        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        <span className="text-border">·</span>
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        <span className="text-border">·</span>
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
      </div>
      <p className="text-center text-[11px] text-muted-foreground/60 mt-3">© {new Date().getFullYear()} FINOVA AI · Educational tool · Not financial advice</p>
    </footer>
  );
}