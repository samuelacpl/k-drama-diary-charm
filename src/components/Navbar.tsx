import { Link, useLocation } from "react-router-dom";
import { BookHeart, Home, Trophy } from "lucide-react";

export function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/ranking", icon: Trophy, label: "Ranking" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <BookHeart size={24} className="text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-xl font-semibold text-foreground">
            K-Drama Diary
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
