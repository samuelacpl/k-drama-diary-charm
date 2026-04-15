import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDramas, saveDrama, deleteDrama } from '@/lib/store';
import { Drama, ActorInfo } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { searchDramas, getDramaDetails, getDramaCast, posterUrl, profileUrl, hasTmdbKey, TmdbSearchResult } from '@/lib/tmdb';
import { Search, Tv } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function Watchlist() {
  const navigate = useNavigate();
  const [dramas, setDramas] = useState<Drama[]>(() => getDramas().filter(d => d.status === 'plan-to-watch'));

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
    // Navigate to Add Drama form pre-filled with this watchlist item's data
    // We pass the drama ID so the form can load it as initial data
    navigate(`/drama/${drama.id}/edit`);
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
              <div key={drama.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 animate-fade-in">
                <Checkbox
                  checked={false}
                  onCheckedChange={() => handleMarkWatched(drama)}
                  className="shrink-0"
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
    </div>
  );
}
