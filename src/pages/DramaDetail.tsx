import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Heart } from 'lucide-react';
import { getDrama, deleteDrama, toggleFavorite } from '@/lib/store';
import { STATUS_OPTIONS } from '@/lib/types';
import StarRating from '@/components/StarRating';
import EmotionalBadges from '@/components/EmotionalBadges';
import EpisodeProgress from '@/components/EpisodeProgress';
import { toast } from 'sonner';
import { useState } from 'react';

export default function DramaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drama, setDrama] = useState(() => id ? getDrama(id) : undefined);

  if (!drama) {
    return (
      <div className="container flex flex-col items-center gap-4 py-20">
        <span className="text-4xl">😢</span>
        <p className="text-muted-foreground">Drama not found</p>
        <Link to="/" className="text-sm text-primary font-medium">Go home</Link>
      </div>
    );
  }

  const status = STATUS_OPTIONS.find(s => s.value === drama.status);

  const handleDelete = () => {
    if (confirm('Delete this drama from your diary?')) {
      deleteDrama(drama.id);
      toast.success('Drama removed');
      navigate('/');
    }
  };

  const handleFavorite = () => {
    toggleFavorite(drama.id);
    setDrama(getDrama(drama.id));
  };

  const Section = ({ title, content }: { title: string; content: string }) => {
    if (!content) return null;
    return (
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-foreground">{content}</p>
      </div>
    );
  };

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex gap-2">
          <button onClick={handleFavorite} className="rounded-xl border border-border p-2 hover:bg-blush/10">
            <Heart size={16} className={drama.isFavorite ? 'fill-rose text-rose' : 'text-muted-foreground'} />
          </button>
          <Link to={`/edit/${drama.id}`} className="rounded-xl border border-border p-2 hover:bg-lavender/10">
            <Pencil size={16} className="text-muted-foreground" />
          </Link>
          <button onClick={handleDelete} className="rounded-xl border border-border p-2 hover:bg-destructive/10">
            <Trash2 size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-48 shrink-0">
          {drama.coverImage ? (
            <img src={drama.coverImage} alt={drama.title} className="w-full rounded-2xl shadow-md object-cover aspect-[2/3]" />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-muted text-5xl">🎬</div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">{drama.title}</h1>
          <StarRating rating={drama.rating} size={22} />
          <EmotionalBadges selected={drama.emotionalTags} size="md" />
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {status && <span className={`rounded-full bg-${status.color}/20 px-2.5 py-1 font-semibold text-foreground`}>{status.label}</span>}
            {drama.platform && <span className="rounded-full bg-muted px-2.5 py-1">{drama.platform}</span>}
          </div>
          {drama.totalEpisodes > 0 && (
            <div className="w-48">
              <EpisodeProgress watched={drama.episodesWatched} total={drama.totalEpisodes} />
            </div>
          )}
          {drama.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {drama.tags.map(tag => (
                <span key={tag} className="rounded-full bg-lavender/20 px-2.5 py-0.5 text-xs font-medium text-foreground">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Diary Content */}
      <div className="space-y-5 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="font-display text-lg font-bold text-foreground">📖 My Diary</h2>
        <Section title="Plot" content={drama.plot} />
        {drama.favoriteQuote && (
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground">💬 Favorite Quote</h3>
            <blockquote className="border-l-4 border-rose/40 bg-blush/10 rounded-r-xl px-4 py-3 italic text-sm text-foreground">
              "{drama.favoriteQuote}"
            </blockquote>
          </div>
        )}
        <Section title="What I Loved" content={drama.whatILiked} />
        <Section title="My Review" content={drama.review} />
      </div>

      {/* Fan Corner */}
      {(drama.favoriteCharacters || drama.favoriteSongs || drama.secondLeadSyndrome) && (
        <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="font-display text-lg font-bold text-foreground">🧸 Fan Corner</h2>
          <Section title="Favorite Characters" content={drama.favoriteCharacters} />
          <Section title="🎵 Favorite OST" content={drama.favoriteSongs} />
          {drama.secondLeadSyndrome && (
            <p className="text-sm font-medium text-rose">😭 Had Second Lead Syndrome</p>
          )}
        </div>
      )}
    </div>
  );
}
