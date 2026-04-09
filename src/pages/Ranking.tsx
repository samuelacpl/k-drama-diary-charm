import { useState, useMemo } from "react";
import { getDramas } from "@/lib/store";
import { Drama } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { Link } from "react-router-dom";
import { Trophy, Crown, Medal } from "lucide-react";

type Filter = "all" | "completed" | "top";

export default function Ranking() {
  const [dramas] = useState<Drama[]>(getDramas);
  const [filter, setFilter] = useState<Filter>("all");

  const ranked = useMemo(() => {
    let list = [...dramas];
    if (filter === "completed") list = list.filter((d) => d.status === "completed");
    if (filter === "top") list = list.filter((d) => d.rating >= 4);
    return list.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [dramas, filter]);

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown size={20} className="text-gold" />;
    if (i === 1) return <Medal size={20} className="text-muted-foreground" />;
    if (i === 2) return <Medal size={20} className="text-rose" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{i + 1}</span>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-2xl py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Trophy size={28} className="text-gold" />
          <h1 className="font-display text-3xl font-semibold">Ranking</h1>
        </div>

        <div className="flex gap-2">
          {([
            { value: "all", label: "All" },
            { value: "completed", label: "Completed" },
            { value: "top", label: "Top Rated" },
          ] as { value: Filter; label: string }[]).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                filter === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {ranked.length > 0 ? (
          <div className="space-y-3">
            {ranked.map((drama, i) => (
              <Link
                key={drama.id}
                to={`/drama/${drama.id}`}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-8 flex justify-center shrink-0">
                  {rankIcon(i)}
                </div>
                <img
                  src={drama.coverImage || "/placeholder.svg"}
                  alt={drama.title}
                  className="w-12 h-16 object-cover rounded-lg border border-border shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{drama.title}</h3>
                  <StarRating rating={drama.rating} readonly size={12} />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground capitalize shrink-0">
                  {drama.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">No dramas to rank yet 🌸</p>
        )}
      </main>
    </div>
  );
}
