import { useState, useEffect, useMemo } from "react"; // Aggiunti hooks
import { getDramas } from "@/lib/store";
import { ACHIEVEMENTS, Drama } from "@/lib/types"; // Importato Drama
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { X, Loader2 } from "lucide-react"; // Aggiunto Loader2

export default function Stats() {
  const [allDramas, setAllDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGlassimo, setShowGlassimo] = useState(false);

  // 1. Caricamento dati asincrono
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getDramas();
        // Filtriamo subito per escludere la Watchlist dalle statistiche
        setAllDramas(data.filter((d) => d.status !== "plan-to-watch"));
      } catch (error) {
        console.error("Errore caricamento statistiche:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Calcoli statistici (avvengono solo quando allDramas cambia)
  const stats = useMemo(() => {
    const completed = allDramas.filter((d) => d.status === "completed").length;
    const totalEps = allDramas.reduce(
      (s, d) => s + (d.episodesWatched || 0),
      0,
    );
    const avgRating = allDramas.length
      ? (
          allDramas.reduce((s, d) => s + d.rating, 0) / allDramas.length
        ).toFixed(1)
      : "0";
    const watchHours = Math.round(totalEps * 1.1);
    const glassimoCount = allDramas.filter((d) => d.watchedWithGlassimo).length;
    const glassimoDramas = allDramas.filter((d) => d.watchedWithGlassimo);

    const genreCount: Record<string, number> = {};
    allDramas.forEach((d) =>
      (d.tags ?? []).forEach((t) => {
        genreCount[t] = (genreCount[t] || 0) + 1;
      }),
    );
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const unlocked = ACHIEVEMENTS.filter((a) => a.check(allDramas));

    return {
      completed,
      totalEps,
      avgRating,
      watchHours,
      glassimoCount,
      glassimoDramas,
      topGenres,
      unlocked,
    };
  }, [allDramas]);

  const StatCard = ({
    label,
    value,
    emoji,
    onClick,
  }: {
    label: string;
    value: string | number;
    emoji: string;
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-5 text-center ${onClick ? "cursor-pointer hover:border-primary/40 transition-colors" : ""}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-2xl py-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            📊 My Stats
          </h1>
          <p className="text-sm text-muted-foreground">
            Your K-Drama journey at a glance
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-2" size={32} />
            <p className="text-xs text-muted-foreground">
              Analyzing your drama history...
            </p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Dramas" value={allDramas.length} emoji="📺" />
              <StatCard label="Completed" value={stats.completed} emoji="✅" />
              <StatCard label="Episodes" value={stats.totalEps} emoji="🎬" />
              <StatCard label="Avg Rating" value={stats.avgRating} emoji="⭐" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <span className="text-2xl">⏱️</span>
                <p className="text-lg font-bold text-foreground mt-1">
                  ~{stats.watchHours} hours
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated watch time
                </p>
              </div>
              <StatCard
                label="With Glassimo"
                value={stats.glassimoCount}
                emoji="🥂"
                onClick={() => setShowGlassimo(true)}
              />
            </div>

            {/* Glassimo Modal */}
            {showGlassimo && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                onClick={() => setShowGlassimo(false)}
              >
                <div
                  className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">
                      🥂 Watched with Glassimo
                    </h3>
                    <button
                      onClick={() => setShowGlassimo(false)}
                      className="p-1 rounded-full hover:bg-secondary"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {stats.glassimoDramas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No dramas watched with Glassimo yet!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {stats.glassimoDramas.map((d) => (
                        <Link
                          key={d.id}
                          to={`/drama/${d.id}`}
                          onClick={() => setShowGlassimo(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                        >
                          <img
                            src={d.coverImage || "/placeholder.svg"}
                            alt={d.title}
                            className="w-10 h-14 object-cover rounded-lg border border-border"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {d.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {stats.topGenres.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-lg font-bold text-foreground">
                  🏷️ Top Genres
                </h2>
                <div className="space-y-2">
                  {stats.topGenres.map(([genre, count]) => (
                    <div key={genre} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground w-24 truncate">
                        {genre}
                      </span>
                      <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-lavender to-rose"
                          style={{
                            width: `${(count / stats.topGenres[0][1]) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                🏆 Achievements
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = stats.unlocked.some(
                    (u) => u.id === ach.id,
                  );
                  return (
                    <div
                      key={ach.id}
                      className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${isUnlocked ? "border-yellow-500/40 bg-yellow-500/5" : "border-border bg-card opacity-40"}`}
                    >
                      <span className="text-2xl">{ach.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {ach.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
