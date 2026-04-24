import { useState, useMemo, useEffect } from "react"; // Aggiunto useEffect
import { getDramas } from "@/lib/store";
import { Drama, ActorInfo } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { StarRating } from "@/components/StarRating";
import { profileUrl } from "@/lib/tmdb";
import { Link } from "react-router-dom";
import { Trophy, Crown, Medal, Loader2 } from "lucide-react"; // Aggiunto Loader2

type DramaFilter = "all" | "completed" | "top";
type Tab = "dramas" | "actors";

interface ActorRank {
  id: number;
  name: string;
  profilePath: string;
  lovedCount: number;
  hatedCount: number;
  dramaCount: number;
}

export default function Ranking() {
  // 1. Inizializziamo lo stato vuoto e aggiungiamo il caricamento
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dramas");
  const [filter, setFilter] = useState<DramaFilter>("all");

  // 2. Caricamento dati asincrono
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const allData = await getDramas();
        // Escludiamo la watchlist dal ranking
        setDramas(allData.filter((d) => d.status !== "plan-to-watch"));
      } catch (error) {
        console.error("Errore nel caricamento ranking:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 3. Calcolo classifica Drama (dipende da 'dramas')
  const ranked = useMemo(() => {
    let list = [...dramas];
    if (filter === "completed")
      list = list.filter((d) => d.status === "completed");
    if (filter === "top") list = list.filter((d) => d.rating >= 4);
    return list.sort(
      (a, b) =>
        b.rating - a.rating ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [dramas, filter]);

  // 4. Calcolo classifica Attori (dipende da 'dramas')
  const actorRanking = useMemo(() => {
    const map = new Map<number, ActorRank>();
    dramas.forEach((d) => {
      (d.cast ?? []).forEach((a: ActorInfo) => {
        if (!map.has(a.id)) {
          map.set(a.id, {
            id: a.id,
            name: a.name,
            profilePath: a.profilePath,
            lovedCount: 0,
            hatedCount: 0,
            dramaCount: 0,
          });
        }
        const r = map.get(a.id)!;
        r.dramaCount++;
        if (a.reaction === "loved") r.lovedCount++;
        if (a.reaction === "hated") r.hatedCount++;
      });
    });
    return Array.from(map.values()).sort(
      (a, b) => b.lovedCount - a.lovedCount || a.name.localeCompare(b.name),
    );
  }, [dramas]);

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown size={20} className="text-yellow-500" />; // Cambiato in yellow-500 se 'gold' non è definito
    if (i === 1) return <Medal size={20} className="text-slate-400" />;
    if (i === 2) return <Medal size={20} className="text-amber-700" />;
    return (
      <span className="text-sm font-bold text-muted-foreground w-5 text-center">
        {i + 1}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-2xl py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Trophy size={28} className="text-yellow-500" />
          <h1 className="font-display text-3xl font-semibold">Ranking</h1>
        </div>

        <div className="flex gap-2 border-b border-border pb-2">
          {(["dramas", "actors"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-semibold px-4 py-2 rounded-t-xl transition-colors capitalize ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t === "dramas" ? "📺 Dramas" : "🎭 Actors"}
            </button>
          ))}
        </div>

        {/* 5. Gestione stato caricamento */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-2" size={32} />
            <p className="text-xs text-muted-foreground">
              Calculating leaderboard...
            </p>
          </div>
        ) : (
          <>
            {tab === "dramas" && (
              <>
                <div className="flex gap-2">
                  {(
                    [
                      { value: "all", label: "All" },
                      { value: "completed", label: "Completed" },
                      { value: "top", label: "Top Rated" },
                    ] as { value: DramaFilter; label: string }[]
                  ).map(({ value, label }) => (
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
                          <h3 className="font-semibold text-sm truncate">
                            {drama.title}
                          </h3>
                          <StarRating
                            rating={drama.rating}
                            readonly
                            size={12}
                          />
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize shrink-0">
                          {drama.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-16">
                    No dramas to rank yet 🌸
                  </p>
                )}
              </>
            )}

            {tab === "actors" &&
              (actorRanking.length > 0 ? (
                <div className="space-y-3">
                  {actorRanking.map((actor, i) => {
                    const imgSrc = actor.profilePath?.startsWith("http")
                      ? actor.profilePath
                      : profileUrl(actor.profilePath);
                    return (
                      <div
                        key={actor.id}
                        className="glass-card rounded-2xl p-4 flex items-center gap-4 animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="w-8 flex justify-center shrink-0">
                          {rankIcon(i)}
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-muted shrink-0">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              🎭
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {actor.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {actor.dramaCount} drama
                            {actor.dramaCount > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex gap-2 text-sm shrink-0">
                          {actor.lovedCount > 0 && (
                            <span>❤️ {actor.lovedCount}</span>
                          )}
                          {actor.hatedCount > 0 && (
                            <span>💀 {actor.hatedCount}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-16">
                  No actors yet! Add dramas with TMDb search 🎭
                </p>
              ))}
          </>
        )}
      </main>
    </div>
  );
}
