import { ActorInfo } from '@/lib/types';
import { profileUrl } from '@/lib/tmdb';

interface ActorCardProps {
  actor: ActorInfo;
  onReact?: (reaction: 'loved' | 'hated') => void;
  showReaction?: boolean;
}

export default function ActorCard({ actor, onReact, showReaction = true }: ActorCardProps) {
  const imgSrc = actor.profilePath?.startsWith('http')
    ? actor.profilePath
    : profileUrl(actor.profilePath);

  return (
    <div className="flex flex-col items-center text-center space-y-2 group">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted shrink-0">
        {imgSrc ? (
          <img src={imgSrc} alt={actor.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">🎭</div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-foreground line-clamp-1">{actor.name}</p>
        <p className="text-[10px] text-muted-foreground line-clamp-1">{actor.character}</p>
      </div>
      {showReaction && onReact && (
        <div className="flex gap-1">
          <button
            onClick={() => onReact('loved')}
            className={`text-sm px-2 py-0.5 rounded-full transition-all ${
              actor.reaction === 'loved' ? 'bg-rose/20 scale-110' : 'hover:bg-secondary'
            }`}
          >
            ❤️
          </button>
          <button
            onClick={() => onReact('hated')}
            className={`text-sm px-2 py-0.5 rounded-full transition-all ${
              actor.reaction === 'hated' ? 'bg-muted scale-110' : 'hover:bg-secondary'
            }`}
          >
            💀
          </button>
        </div>
      )}
    </div>
  );
}
