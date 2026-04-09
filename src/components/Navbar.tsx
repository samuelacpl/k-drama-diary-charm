import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, BarChart3, Plus } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          🌸 K-Drama Diary
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <Link
            to="/add"
            className="ml-2 flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
