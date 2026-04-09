import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Drama } from "@/lib/types";
import { StarRating } from "./StarRating";
import { saveDrama } from "@/lib/store";

interface DramaCardProps {
  drama: Drama;
  onUpdate?: () => void;
}

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
  };

  // Dentro il componente che renderizza la card
const ProgressPct = (drama.episodesWatched / drama.totalEpisodes) * 100;

return (
  <div className="bg-white rounded-3xl p-4 shadow-sm border border-pink-50">
    {/* ... resto del codice del poster ... */}

    {/* BARRA DI PROGRESSO (Punto 2) */}
    <div className="mt-4">
      <div className="flex justify-between text-xs mb-1 text-gray-500 font-medium">
        <span>Episodio {drama.episodesWatched}/{drama.totalEpisodes}</span>
        <span>{Math.round(ProgressPct)}%</span>
      </div>
      <div className="w-full bg-pink-50 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-pink-300 h-full rounded-full transition-all duration-500" 
          style={{ width: `${ProgressPct}%` }}
        />
      </div>
    </div>
    
    {/* BADGE DELLO STATO */}
    <div className="mt-2">
      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-pink-100 text-pink-600 rounded-lg">
        {drama.status}
      </span>
    </div>
  </div>
);

  return (
    <Link
      to={`/drama/${drama.id}`}
      className="group block animate-fade-in"
    >
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={drama.coverImage || "/placeholder.svg"}
            alt={drama.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/60 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart
              size={18}
              className={`transition-colors ${
                drama.isFavorite ? "fill-rose text-rose" : "text-foreground/50"
              }`}
            />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[drama.status] || ""}`}>
              {drama.status}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1">
            {drama.title}
          </h3>
          <StarRating rating={drama.rating} readonly size={14} />
          {drama.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {drama.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
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
