import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BookOpen, PiggyBank, MessageCircle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/market', icon: TrendingUp, label: 'Market' },
  { to: '/stocks', icon: PiggyBank, label: 'Stocks' },
  { to: '/education', icon: BookOpen, label: 'Learn' },
  { to: '/analyst', icon: MessageCircle, label: 'AI Chat' },
];

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/60">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[52px] ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}