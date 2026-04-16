import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDramas, saveDrama, deleteDrama } from '@/lib/store';
import { Drama, ActorInfo } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { searchDramas, getDramaDetails, getDramaCast, posterUrl, profileUrl, hasTmdbKey, TmdbSearchResult } from '@/lib/tmdb';
import { Search, Tv, X as XIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function Watchlist() {
  const navigate = useNavigate();
  const [dramas, setDramas] = useState<Drama[]>(() => getDramas().filter(d => d.status === 'plan-to-watch'));
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);

  // TMDb search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const refresh = () => setDramas(getDramas().filter(d => d.status === 'plan-to-watch'));

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await searchDramas(q);
      setResults(res);
      setLoading(false);
    }, 400);
  }, []);

  const addToWatchlist = async (result: TmdbSearchResult) => {
    setShowResults(false);
    setQuery('');
    setResults([]);

    const existing = getDramas().find(d => d.tmdbId === result.id);
    if (existing) {
      toast.info('This drama is already in your diary!');
      return;
    }

    let totalEpisodes = 16;
    let cast: ActorInfo[] = [];
    let plot = '';

    const detail = await getDramaDetails(result.id);
    if (detail) {
      totalEpisodes = detail.number_of_episodes || 16;
      plot = detail.overview || '';
    }

    const castData = await getDramaCast(result.id);
    if (castData.length) {
      cast = castData.slice(0, 12).map(c => ({
        id: c.id, name: c.name, character: c.character,
        profilePath: c.profile_path || '',
      }));
    }

    const drama: Drama = {
      id: crypto.randomUUID(),
      title: result.name,
      platform: '',
      totalEpisodes,
      episodesWatched: 0,
      status: 'plan-to-watch',
      coverImage: posterUrl(result.poster_path, 'w500'),
      actors: cast.map(a => a.name).join(', '),
      favoriteQuote: '',
      favoriteQuotes: [],
      plot,
      whatILiked: '',
      review: '',
      rating: 0,
      tags: [],
      emotionalTags: [],
      favoriteCharacters: '',
      favoriteSongs: '',
      secondLeadSyndrome: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      watchingImages: [],
      watchedWithGlassimo: false,
      glassimoReview: '',
      tmdbId: result.id,
      cast,
    };

    saveDrama(drama);
    refresh();
    toast.success(`"${result.name}" added to Watchlist! 📌`);
  };

  const handleMarkWatched = (drama: Drama) => {
    navigate(`/drama/${drama.id}/edit`);
  };

  const handleRemove = (e: React.MouseEvent, drama: Drama) => {
    e.stopPropagation();
    deleteDrama(drama.id);
    refresh();
    toast.success(`"${drama.title}" removed from Watchlist`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-3xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">📺 Watchlist</h1>
          <p className="text-sm text-muted-foreground">Dramas you plan to watch</p>
        </div>

        {/* Search */}
        {hasTmdbKey() && (
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => { handleSearch(e.target.value); setShowResults(true); }}
              onFocus={() => results.length && setShowResults(true)}
              placeholder="Search K-Drama to add..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border-2 border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {showResults && (results.length > 0 || loading) && (
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-72 overflow-y-auto">
                {loading ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">Searching...</p>
                ) : results.map(r => (
                  <button key={r.id} onClick={() => addToWatchlist(r)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left">
                    <img src={posterUrl(r.poster_path, 'w92')} alt="" className="w-10 h-14 object-cover rounded-lg border border-border bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.first_air_date?.slice(0, 4) || 'N/A'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Watchlist Items */}
        {dramas.length > 0 ? (
          <div className="space-y-3">
            {dramas.map(drama => (
              <div key={drama.id} onClick={() => setSelectedDrama(drama)}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 animate-fade-in cursor-pointer hover:border-primary/30 transition-colors">
                <Checkbox
                  checked={false}
                  onCheckedChange={(e) => { e && handleMarkWatched(drama); }}
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <img
                  src={drama.coverImage || '/placeholder.svg'}
                  alt={drama.title}
                  className="w-12 h-16 object-cover rounded-lg border border-border shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{drama.title}</h3>
                  <p className="text-xs text-muted-foreground">{drama.totalEpisodes} episodes</p>
                  {drama.actors && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{drama.actors}</p>
                  )}
                </div>
                <button onClick={(e) => handleRemove(e, drama)}
                  className="p-2 rounded-full hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive shrink-0">
                  <XIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <Tv size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">Your watchlist is empty!</p>
            <p className="text-sm text-muted-foreground">Search for a K-Drama above to add it 🌸</p>
          </div>
        )}
      </main>

      {/* Drama Detail Modal */}
      <Dialog open={!!selectedDrama} onOpenChange={(open) => !open && setSelectedDrama(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-0 rounded-2xl border-border">
          {selectedDrama && (
            <div className="space-y-4 p-6">
              <img
                src={selectedDrama.coverImage || '/placeholder.svg'}
                alt={selectedDrama.title}
                className="w-full aspect-[2/3] object-cover rounded-xl border border-border"
              />
              <h2 className="font-display text-xl font-bold text-foreground">{selectedDrama.title}</h2>
              <p className="text-xs text-muted-foreground">{selectedDrama.totalEpisodes} episodes</p>

              {selectedDrama.plot && (
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">📖 Overview</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedDrama.plot}</p>
                </div>
              )}

              {(selectedDrama.cast?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">🎭 Cast</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedDrama.cast.slice(0, 8).map(actor => {
                      const imgSrc = actor.profilePath?.startsWith('http') ? actor.profilePath : profileUrl(actor.profilePath);
                      return (
                        <div key={actor.id} className="text-center" style={{ width: 60 }}>
                          <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border border-border bg-muted">
                            {imgSrc ? <img src={imgSrc} alt={actor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🎭</div>}
                          </div>
                          <p className="text-[10px] font-semibold text-foreground mt-1 line-clamp-1">{actor.name}</p>
                          <p className="text-[9px] text-muted-foreground line-clamp-1">{actor.character}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
