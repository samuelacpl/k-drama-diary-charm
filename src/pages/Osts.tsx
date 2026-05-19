import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Music, Play, Pause } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useDramas } from "@/hooks/useDramas";

function PlayButton({ preview, id, current, setCurrent }: { preview?: string; id: string; current: string | null; setCurrent: (id: string | null) => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playing = current === id;
  useEffect(() => {
    if (!playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [playing]);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!preview) return;
    if (playing) { setCurrent(null); return; }
    const audio = new Audio(preview);
    audioRef.current = audio;
    audio.play().catch(() => {});
    audio.onended = () => setCurrent(null);
    setCurrent(id);
  };
  if (!preview) return null;
  return (
    <button onClick={toggle} className="p-2 rounded-full bg-blush/40 hover:bg-blush/60 text-foreground transition-colors shrink-0" aria-label={playing ? 'Pause' : 'Play'}>
      {playing ? <Pause size={14} /> : <Play size={14} />}
    </button>
  );
}

export default function Osts() {
  const { data: dramas = [], isLoading } = useDramas();
  const [currentId, setCurrentId] = useState<string | null>(null);

  const items = useMemo(() => {
    return dramas.flatMap((d) =>
      (d.osts ?? []).map((t) => ({
        ...t,
        dramaId: d.id,
        dramaTitle: d.title,
      })),
    );
  }, [dramas]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">🎵 OSTs</h1>
          <p className="text-sm text-muted-foreground">All your favorite K-Drama soundtracks</p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground animate-pulse py-12">Loading…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Music size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No OSTs yet. Add some from the Fan Corner of any drama.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((t, i) => (
              <div
                key={`${t.dramaId}-${t.id}-${i}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:shadow-md transition-shadow"
              >
                <Link to={`/drama/${t.dramaId}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                    {t.cover ? (
                      <img src={t.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <Music size={20} className="m-auto text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{t.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{t.artist}</p>
                    <p className="text-[10px] text-primary font-semibold mt-0.5 line-clamp-1">📺 {t.dramaTitle}</p>
                  </div>
                </Link>
                <PlayButton preview={t.preview} id={`${t.dramaId}-${t.id}-${i}`} current={currentId} setCurrent={setCurrentId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}