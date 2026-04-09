import { Link } from 'react-router-dom';
import { Heart, Pencil } from 'lucide-react';
import { Drama, STATUS_OPTIONS } from '@/lib/types';
import { toggleFavorite } from '@/lib/store';
import StarRating from './StarRating';
import EmotionalBadges from './EmotionalBadges';
import EpisodeProgress from './EpisodeProgress';

interface DramaCardProps {
  drama: Drama;
  onUpdate: () => void;
}

export default function DramaCard({ drama, onUpdate }: DramaCardProps) {
  const status = STATUS_OPTIONS.find(s => s.value === drama.status);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(drama.id);
    onUpdate();
  };

  return (
    <Link
      to={`/drama/${drama.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {drama.coverImage ? (
          <img src={drama.coverImage} alt={drama.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🎬</div>
        )}
        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className="absolute right-2 top-2 rounded-full bg-background/70 p-1.5 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart size={16} className={drama.isFavorite ? 'fill-rose text-rose' : 'text-muted-foreground'} />
        </button>
        {/* Edit */}
        <Link
          to={`/edit/${drama.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-2 top-2 rounded-full bg-background/70 p-1.5 backdrop-blur transition-transform hover:scale-110"
        >
          <Pencil size={14} className="text-muted-foreground" />
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Status badge */}
        {status && (
          <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-${status.color}/20 text-foreground`}>
            {status.label}
          </span>
        )}

        <h3 className="font-display text-sm font-bold leading-tight text-foreground line-clamp-2">
          {drama.title}
        </h3>

        <StarRating rating={drama.rating} size={14} />

        <EmotionalBadges selected={drama.emotionalTags} />

        {/* Episode progress */}
        {drama.totalEpisodes > 0 && (
          <EpisodeProgress watched={drama.episodesWatched} total={drama.totalEpisodes} />
        )}

        {/* Tags */}
        {drama.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {drama.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-full bg-lavender/20 px-2 py-0.5 text-[10px] font-medium text-foreground">
                {tag}
              </span>
            ))}
            {drama.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{drama.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
