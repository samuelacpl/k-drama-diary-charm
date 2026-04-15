import { Link, useLocation } from "react-router-dom";
import { BookHeart, Home, Trophy, BarChart3, Image, Users, Quote, Tv } from "lucide-react";

export function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/watchlist", icon: Tv, label: "Watchlist" },
    { to: "/ranking", icon: Trophy, label: "Ranking" },
    { to: "/gallery", icon: Image, label: "Gallery" },
    { to: "/quotes", icon: Quote, label: "Quotes" },
    { to: "/stats", icon: BarChart3, label: "Stats" },
    { to: "/actors", icon: Users, label: "Actors" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <BookHeart size={24} className="text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-xl font-semibold text-foreground hidden sm:inline">K-Drama Diary</span>
        </Link>
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Icon size={14} />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
