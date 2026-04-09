import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, SortAsc } from "lucide-react";
import { getDramas } from "@/lib/store";
import { Drama } from "@/lib/types";
import { DramaCard } from "@/components/DramaCard";
import { Navbar } from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";

type SortOption = "rating" | "date" | "favorites";

export default function Index() {
  const [dramas, setDramas] = useState<Drama[]>(getDramas);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date");

  const refresh = () => setDramas(getDramas());

  const filtered = useMemo(() => {
    let list = dramas.filter((d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );
    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "favorites":
        list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        break;
      case "date":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [dramas, search, sort]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      {dramas.length === 0 && (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img src={heroBg} alt="K-Drama aesthetic" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-3">
              Your K-Drama Diary
            </h1>
            <p className="text-muted-foreground max-w-md">
              Track, review, and cherish every drama you watch 🌸
            </p>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="container py-8 space-y-6">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dramas or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <SortAsc size={16} className="text-muted-foreground" />
            {(["date", "rating", "favorites"] as SortOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSort(opt)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors capitalize ${
                  sort === opt
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map((drama) => (
              <DramaCard key={drama.id} drama={drama} onUpdate={refresh} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              {search ? "No dramas found ✨" : "Start adding your favorite dramas!"}
            </p>
            {!search && (
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                <Plus size={18} />
                Add Your First Drama
              </Link>
            )}
          </div>
        )}
      </main>

      {/* FAB */}
      <Link
        to="/add"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-float"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}
