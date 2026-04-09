export function DramaCard({ drama, onUpdate }: DramaCardProps) {
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveDrama({ ...drama, isFavorite: !drama.isFavorite });
    onUpdate?.();
  };

  const statusColors: Record<string, string> = {
    watching: "bg-sage text-accent-foreground",
    completed: "bg-lavender text-accent-foreground",
    dropped: "bg-blush text-accent-foreground",
    "plan-to-watch": "bg-slate-200 text-slate-600",
  };

  // Calcolo corretto della percentuale usando episodesWatched
  const progressPct = (drama.episodesWatched / drama.totalEpisodes) * 100;

  return (
    <Link to={`/drama/${drama.id}`} className="group block animate-fade-in">
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={drama.coverImage || "/placeholder.svg"}
            alt={drama.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Bottone Preferiti */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/60 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart size={18} className={`transition-colors ${drama.isFavorite ? "fill-rose text-rose" : "text-foreground/50"}`} />
          </button>

          {/* Badge Stato (Punto 2) */}
          <div className="absolute bottom-3 left-3">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColors[drama.status] || ""}`}>
              {drama.status}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1">
            {drama.title}
          </h3>
          
          <StarRating rating={drama.rating} readonly size={14} />

          {/* BARRA DI PROGRESSO (Punto 2) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
              <span>Ep. {drama.episodesWatched}/{drama.totalEpisodes}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* TAGS (Punto 7) */}
          {drama.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {drama.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground border border-border/50">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
