import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drama, DramaStatus, WatchingImage, PLATFORMS, GENRE_TAGS, STATUS_OPTIONS } from '@/lib/types';
import { StarRating } from './StarRating';
import EmotionalBadges from './EmotionalBadges';
import EpisodeStepper from './EpisodeStepper';
import { toast } from 'sonner';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';

interface DramaFormProps {
  initial?: Drama;
  onSubmit: (data: Omit<Drama, 'id' | 'createdAt'>) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DramaForm({ initial, onSubmit }: DramaFormProps) {
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const watchingInputRef = useRef<HTMLInputElement>(null);

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
  const [watchingImages, setWatchingImages] = useState<WatchingImage[]>(initial?.watchingImages ?? []);
  const [watchedWithGlassimo, setWatchedWithGlassimo] = useState(initial?.watchedWithGlassimo ?? false);
  const [glassimoReview, setGlassimoReview] = useState(initial?.glassimoReview ?? '');

  useEffect(() => {
    if (status === 'completed' && totalEpisodes > 0) {
      setEpisodesWatched(totalEpisodes);
    }
  }, [status, totalEpisodes]);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setCoverImage(dataUrl);
  };

  const handleWatchingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      setWatchingImages(prev => [...prev, { id: crypto.randomUUID(), dataUrl, comment: '' }]);
    }
    e.target.value = '';
  };

  const removeWatchingImage = (id: string) => {
    setWatchingImages(prev => prev.filter(img => img.id !== id));
  };

  const updateWatchingImageComment = (id: string, comment: string) => {
    setWatchingImages(prev => prev.map(img => img.id === id ? { ...img, comment } : img));
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
      watchingImages, watchedWithGlassimo, glassimoReview,
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

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className={labelClass}>Cover Image</label>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          {coverImage ? (
            <div className="relative w-32 aspect-[2/3] rounded-xl overflow-hidden border border-border group">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setCoverImage('')} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={14} className="text-destructive" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => coverInputRef.current?.click()} className="flex flex-col items-center gap-2 w-32 aspect-[2/3] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors justify-center">
              <Upload size={20} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </button>
          )}
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
            <button key={opt.value} type="button" onClick={() => setStatus(opt.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                status === opt.value
                  ? 'bg-primary/20 border-2 border-primary text-foreground scale-105'
                  : 'border-2 border-border bg-card text-muted-foreground hover:border-primary/30'
              }`}>
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
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                tags.includes(tag)
                  ? 'bg-lavender/30 border border-lavender text-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:border-lavender/50'
              }`}>
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

      {/* Watching It - Images */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">📸 Watching It</h2>
        <p className="text-xs text-muted-foreground">Capture moments while watching!</p>
        <input ref={watchingInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleWatchingImageUpload} />
        <div className="grid grid-cols-2 gap-3">
          {watchingImages.map(img => (
            <div key={img.id} className="relative rounded-xl border border-border overflow-hidden bg-card group">
              <img src={img.dataUrl} alt="" className="w-full aspect-square object-cover" />
              <button type="button" onClick={() => removeWatchingImage(img.id)} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={14} className="text-destructive" />
              </button>
              <div className="p-2">
                <input
                  value={img.comment}
                  onChange={e => updateWatchingImageComment(img.id, e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full text-xs bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => watchingInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <Plus size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add photo</span>
          </button>
        </div>
      </div>

      {/* Glassimo Toggle */}
      <div className={sectionClass}>
        <h2 className="font-display text-lg font-bold text-foreground">🥂 Watched with Glassimo</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setWatchedWithGlassimo(!watchedWithGlassimo)}
            className={`relative w-12 h-6 rounded-full transition-colors ${watchedWithGlassimo ? 'bg-primary' : 'bg-muted'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${watchedWithGlassimo ? 'translate-x-6' : ''}`} />
          </button>
          <span className="text-sm text-foreground">{watchedWithGlassimo ? 'Yes! 🥂' : 'No'}</span>
        </div>
        {watchedWithGlassimo && (
          <div className="space-y-1 animate-fade-in">
            <label className={labelClass}>Glassimo Review</label>
            <textarea value={glassimoReview} onChange={e => setGlassimoReview(e.target.value)} rows={3} placeholder="What did Glassimo think?..." className={inputClass} />
          </div>
        )}
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
          <button type="button" onClick={() => setSecondLeadSyndrome(!secondLeadSyndrome)}
            className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
              secondLeadSyndrome ? 'bg-rose/20 text-foreground border border-rose' : 'bg-card border border-border text-muted-foreground'
            }`}>
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
