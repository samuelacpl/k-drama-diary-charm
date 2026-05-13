import { useState, useRef, useCallback } from 'react';
import { Search, X, Plus, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SpotifyTrack } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  tracks: SpotifyTrack[];
  onChange: (tracks: SpotifyTrack[]) => void;
}

export default function SpotifySearch({ tracks, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(tracks.length === 0);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback((q: string) => {
    setQuery(q);
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spotify-search?q=${encodeURIComponent(q)}`;
        const session = (await supabase.auth.getSession()).data.session;
        const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(url, {
          headers: {
            apikey: apiKey,
            Authorization: `Bearer ${session?.access_token ?? apiKey}`,
          },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Spotify error');
        setResults(json.tracks ?? []);
      } catch (err: any) {
        toast.error(err?.message || 'Spotify search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const addTrack = (t: SpotifyTrack) => {
    if (tracks.some(x => x.id === t.id)) {
      toast.error('OST già aggiunto');
      return;
    }
    onChange([...tracks, t]);
    setQuery('');
    setResults([]);
    setOpen(false);
    setShowInput(false);
  };

  const remove = (id: string) => onChange(tracks.filter(t => t.id !== id));

  const inputClass = "w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="space-y-3">
      {tracks.length > 0 && (
        <div className="space-y-2">
          {tracks.map(t => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 pr-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                {t.cover ? <img src={t.cover} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><Music size={18} className="text-muted-foreground" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{t.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{t.artist}</p>
              </div>
              <button type="button" onClick={() => remove(t.id)} className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showInput ? (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => { search(e.target.value); setOpen(true); }}
            onFocus={() => results.length && setOpen(true)}
            placeholder="Cerca un brano su Spotify..."
            className={`${inputClass} pl-9`}
          />
          {open && (results.length > 0 || loading) && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-72 overflow-y-auto">
              {loading ? (
                <p className="p-4 text-sm text-muted-foreground text-center">Searching...</p>
              ) : results.map(r => (
                <button key={r.id} type="button" onClick={() => addTrack(r)}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-secondary/50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    {r.cover ? <img src={r.cover} alt="" className="w-full h-full object-cover" /> : <Music size={16} className="m-auto text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <button type="button" onClick={() => setShowInput(s => !s)}
        className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
        <Plus size={14} /> {showInput ? 'Chiudi' : 'Add OST'}
      </button>
    </div>
  );
}