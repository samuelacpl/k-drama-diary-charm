import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drama, DramaStatus, PLATFORMS, GENRE_TAGS, STATUS_OPTIONS } from '@/lib/types';
import { StarRating } from './StarRating';
import EmotionalBadges from './EmotionalBadges';
import EpisodeStepper from './EpisodeStepper';
import { toast } from 'sonner';

interface DramaFormProps {
  initial?: Drama;
  onSubmit: (data: Omit<Drama, 'id' | 'createdAt'>) => void;
}

export default function DramaForm({ initial, onSubmit }: DramaFormProps) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [platform, setPlatform] = useState(initial?.platform ?? '');
  const [totalEpisodes, setTotalEpisodes] = useState(initial?.totalEpisodes ?? 16);
  const [episodesWatched, setEpisodesWatched] = useState(initial?.episodesWatched ?? 0);
  const [status, setStatus] = useState<DramaStatus>(initial?.status ?? 'plan-to-watch');
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [actors, setActors] = useState(initial?.actors ?? '');
  const [favoriteQuote, setFavoriteQuote] = useState(initial?.favoriteQuote ?? '');
  const [plot, setPlot] = useState(initial?.plot ?? '');
  const [whatILiked, setWhatILiked] = useState(initial?.whatILiked ?? '');
  const [review, setReview] = useState(initial?.review ?? '');
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [emotionalTags, setEmotionalTags] = useState<string[]>(initial?.emotionalTags ?? []);
  const [favoriteCharacters, setFavoriteCharacters] = useState(initial?.favoriteCharacters ?? '');
  const [favoriteSongs, setFavoriteSongs] = useState(initial?.favoriteSongs ?? '');
  const [secondLeadSyndrome, setSecondLeadSyndrome] = useState(initial?.secondLeadSyndrome ?? false);

  useEffect(() => {
    if (status === 'completed' && totalEpisodes > 0) {
      setEpisodesWatched(totalEpisodes);
    }
  }, [status, totalEpisodes]);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    onSubmit({
      title, platform, totalEpisodes, episodesWatched, status, coverImage,
      actors, favoriteQuote, plot, whatILiked, review, rating, tags, emotionalTags,
      favoriteCharacters, favoriteSongs, secondLeadSyndrome,
      isFavorite: initial?.isFavorite ?? false,
    });
  };

  const inputClass = "w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";
  const labelClass = "text-sm font-semibold text-foreground";
  const sectionClass = "space-y-4 rounded-2xl border border-border bg-card/50 p-5";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 pb-10">
      {/* Basic Info */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">📝 Basic Info</h2>
        <div className="space-y-1">
          <label className={labelClass}>Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Drama title..." className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className={inputClass}>
              <option value="">Select...</option>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Total Episodes</label>
            <input type="number" min={1} value={totalEpisodes} onChange={e => setTotalEpisodes(Number(e.target.value))} className={inputClass} />
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Cover Image URL</label>
          <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Main Actors</label>
          <input value={actors} onChange={e => setActors(e.target.value)} placeholder="Actor names..." className={inputClass} />
        </div>
      </div>

      {/* Watch Status */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">📺 Watch Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                status === opt.value
                  ? 'bg-primary/20 border-2 border-primary text-foreground scale-105'
                  : 'border-2 border-border bg-card text-muted-foreground hover:border-primary/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Episodes Watched</label>
          <EpisodeStepper value={episodesWatched} max={totalEpisodes} onChange={setEpisodesWatched} />
          {status === 'completed' && episodesWatched === totalEpisodes && (
            <p className="text-xs text-sage font-medium animate-fade-in">✨ Auto-filled to {totalEpisodes} episodes!</p>
          )}
        </div>
      </div>

      {/* Rating & Emotions */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">⭐ Rating & Feelings</h2>
        <div className="space-y-2">
          <label className={labelClass}>Star Rating</label>
          <StarRating rating={rating} onChange={setRating} size={28} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>How did it make you feel?</label>
          <EmotionalBadges selected={emotionalTags} onChange={setEmotionalTags} />
        </div>
      </div>

      {/* Genre Tags */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">🏷️ Genre Tags</h2>
        <div className="flex flex-wrap gap-2">
          {GENRE_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                tags.includes(tag)
                  ? 'bg-lavender/30 border border-lavender text-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:border-lavender/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Diary Section */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">📖 My Diary</h2>
        <div className="space-y-1">
          <label className={labelClass}>Plot / Summary</label>
          <textarea value={plot} onChange={e => setPlot(e.target.value)} rows={3} placeholder="What's it about..." className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>💬 Favorite Quote</label>
          <textarea value={favoriteQuote} onChange={e => setFavoriteQuote(e.target.value)} rows={2} placeholder="That one line..." className={`${inputClass} italic`} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>What I Loved</label>
          <textarea value={whatILiked} onChange={e => setWhatILiked(e.target.value)} rows={2} placeholder="The best parts..." className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>My Review</label>
          <textarea value={review} onChange={e => setReview(e.target.value)} rows={3} maxLength={280} placeholder="Your thoughts..." className={inputClass} />
          <p className="text-right text-xs text-muted-foreground">{review.length}/280</p>
        </div>
      </div>

      {/* Fan Corner */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">🧸 Fan Corner</h2>
        <div className="space-y-1">
          <label className={labelClass}>Favorite Characters</label>
          <input value={favoriteCharacters} onChange={e => setFavoriteCharacters(e.target.value)} placeholder="Who stole your heart..." className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>🎵 Favorite OST Songs</label>
          <input value={favoriteSongs} onChange={e => setFavoriteSongs(e.target.value)} placeholder="Songs you can't stop listening to..." className={inputClass} />
        </div>
        <div className="flex items-center gap-3">
          <label className={labelClass}>Second Lead Syndrome?</label>
          <button
            type="button"
            onClick={() => setSecondLeadSyndrome(!secondLeadSyndrome)}
            className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
              secondLeadSyndrome ? 'bg-rose/20 text-foreground border border-rose' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {secondLeadSyndrome ? '😭 YES' : 'No'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
          {initial ? '💾 Save Changes' : '🌸 Save Drama'}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="rounded-xl border-2 border-border bg-card px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
