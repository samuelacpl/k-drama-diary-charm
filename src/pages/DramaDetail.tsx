import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Trash2,
  Edit,
  Tv,
  Play,
  Pause,
} from "lucide-react";
import { getDrama, saveDrama, deleteDrama } from "@/lib/store";
import { StarRating } from "@/components/StarRating";
import EmotionalBadges from "@/components/EmotionalBadges";
import { Navbar } from "@/components/Navbar";
import QuotesSlider from "@/components/QuotesSlider";
import ActorCard from "@/components/ActorCard";
import { useEffect, useRef, useState } from "react";
import { Drama, ActorInfo } from "@/lib/types";
import { useDramas } from "@/hooks/useDramas";
import { Music } from "lucide-react";

function CastCarousel({
  cast,
  onReact,
  readOnly,
}: {
  cast: ActorInfo[];
  onReact: (actorId: number, reaction: "loved" | "hated") => void;
  readOnly?: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">🎭 Cast</h3>
        <span className="text-[10px] text-muted-foreground">{cast.length} · swipe →</span>
      </div>
      <div className="overflow-x-auto -mx-2 px-2 snap-x scroll-smooth">
        <div className="flex gap-4 pb-1">
          {cast.map((actor) => (
            <div key={actor.id} className="shrink-0 snap-start" style={{ width: 80 }}>
              <ActorCard
                actor={actor}
                onReact={
                  readOnly
                    ? undefined
                    : (reaction) => onReact(actor.id, reaction)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OstPlayCard({ t }: { t: { id: string; name: string; artist: string; cover: string; url?: string; preview?: string } }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!t.preview) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    const audio = new Audio(t.preview);
    audioRef.current = audio;
    audio.play().catch(() => {});
    audio.onended = () => setPlaying(false);
    setPlaying(true);
  };
  useEffect(() => () => audioRef.current?.pause(), []);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 pr-3">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
        {t.cover ? <img src={t.cover} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Music size={18} className="m-auto text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground line-clamp-1">{t.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{t.artist}</p>
      </div>
      {t.preview && (
        <button onClick={toggle} className="p-2 rounded-full bg-blush/40 hover:bg-blush/60 text-foreground transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
      )}
      {t.url && (
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary font-semibold hover:underline">↗</a>
      )}
    </div>
  );
}

export default function DramaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: allDramas = [] } = useDramas();
  // inizializziamo a undefined e aggiungiamo stato di caricamennto
  const [drama, setDrama] = useState<Drama | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  // carichiamo il drama all'avvio, se l'id è presente
  useEffect(() => {
    const loadDrama = async () => {
      if (!id) return;
      try {
        const data = await getDrama(id);
        setDrama(data);
      } catch (error) {
        console.error("Errore nel caricamento del drama:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDrama();
  }, [id]);

  // 3. Gestione caricamento
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground animate-pulse">
            Loading drama details...
          </p>
        </div>
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Drama not found 😢</p>
          <Link to="/" className="text-primary font-semibold mt-4 inline-block">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const toggleFavorite = async () => {
    const updated = { ...drama, isFavorite: !drama.isFavorite };
    await saveDrama(updated);
    setDrama(updated);
  };

  const handleDelete = async () => {
    if (confirm("Delete this drama from your diary?")) {
      await deleteDrama(drama.id);
      navigate("/");
    }
  };

  const handleActorReact = async (
    actorId: number,
    reaction: "loved" | "hated",
  ) => {
    const updatedCast = (drama.cast ?? []).map((a) =>
      a.id === actorId
        ? { ...a, reaction: a.reaction === reaction ? undefined : reaction }
        : a,
    );
    const updated = { ...drama, cast: updatedCast };
    await saveDrama(updated);
    setDrama(updated);
  };

  const statusLabel: Record<string, string> = {
    watching: "📺 Watching",
    completed: "✅ Completed",
    dropped: "❌ Dropped",
    "plan-to-watch": "📌 Plan to Watch",
  };

  const tags = drama.tags ?? [];
  const emotionalTags = drama.emotionalTags ?? [];
  const watchingImages = drama.watchingImages ?? [];
  const cast = drama.cast ?? [];
  const quotes = drama.favoriteQuotes?.length
    ? drama.favoriteQuotes
    : drama.favoriteQuote
      ? [drama.favoriteQuote]
      : [];

  const progressPct =
    (drama.totalEpisodes ?? 0) > 0
      ? Math.round(((drama.episodesWatched ?? 0) / drama.totalEpisodes) * 100)
      : 0;

  // Milestone: dramas at positions 50, 100, 150... (excl. plan-to-watch, sorted by createdAt asc)
  const milestone = (() => {
    const visible = allDramas.filter((d) => d.status !== "plan-to-watch");
    const asc = [...visible].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const idx = asc.findIndex((d) => d.id === drama.id);
    if (idx === -1) return 0;
    const pos = idx + 1;
    return pos % 50 === 0 ? pos : 0;
  })();

  const Section = ({ title, content }: { title: string; content?: string }) =>
    content ? (
      <div className="glass-card rounded-2xl p-6 space-y-2 animate-fade-in">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    ) : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-3xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex gap-2">
            <Link
              to={`/drama/${drama.id}/edit`}
              className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            >
              <Edit size={20} />
            </Link>
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Heart
                size={20}
                className={
                  drama.isFavorite
                    ? "fill-rose text-rose"
                    : "text-muted-foreground"
                }
              />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-destructive/10 transition-colors text-destructive"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in">
          <div className="w-full sm:w-48 shrink-0">
            <img
              src={drama.coverImage || "/placeholder.svg"}
              alt={drama.title}
              className="w-full aspect-[2/3] object-cover rounded-2xl border border-border shadow-md"
            />
          </div>
          <div className="space-y-3 flex-1">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold">
              {drama.title}
            </h1>
            <StarRating rating={drama.rating} readonly size={22} />

            {emotionalTags.length > 0 && (
              <EmotionalBadges selected={emotionalTags} size="md" />
            )}

            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                {statusLabel[drama.status]}
              </span>
              {drama.platform && (
                <span className="px-3 py-1 rounded-full bg-lavender text-accent-foreground">
                  {drama.platform}
                </span>
              )}
              {drama.watchedWithGlassimo && (
                <span className="px-3 py-1 rounded-full bg-gold/20 text-foreground">
                  🥂 With Glassimo
                </span>
              )}
            </div>

            {(drama.totalEpisodes ?? 0) > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>
                    Ep. {drama.episodesWatched ?? 0}/{drama.totalEpisodes}
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {drama.actors && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Cast:</span>{" "}
                {drama.actors}
              </p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <Section title="📖 Plot" content={drama.plot} />
          {quotes.length > 0 && <QuotesSlider quotes={quotes} />}
          <Section title="💗 What I Loved" content={drama.whatILiked} />
          <Section title="✍️ My Review" content={drama.review} />
          {drama.watchedWithGlassimo && drama.glassimoReview && (
            <Section
              title="🥂 Glassimo Review"
              content={drama.glassimoReview}
            />
          )}
        </div>

        {/* Watching It Images */}
        {watchingImages.length > 0 && (
          <div className="glass-card rounded-2xl p-6 space-y-3 animate-fade-in">
            <h3 className="font-display text-lg font-semibold">
              📸 Watching It
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {watchingImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-xl overflow-hidden border border-border"
                >
                  <div className="relative">
                    <img
                      src={img.dataUrl}
                      alt={img.comment || ""}
                      className="w-full aspect-square object-cover"
                    />
                    {img.createdAt && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-cream/90 text-foreground text-[10px] font-semibold shadow-sm backdrop-blur-sm">
                        {new Date(img.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  {img.comment && (
                    <p className="p-2 text-xs text-muted-foreground">
                      {img.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fan Corner - with cast carousel (read-only reactions) */}
        {(drama.favoriteCharacters ||
          drama.favoriteSongs ||
          drama.secondLeadSyndrome ||
          cast.length > 0) && (
          <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                🧸 Fan Corner
              </h3>
              {milestone > 0 && (
                <span className="relative flex items-center gap-1 px-3 py-1 rounded-full bg-blush text-foreground text-xs font-extrabold shadow-sm">
                  <span className="text-sm leading-none">⭐</span>
                  <span>Milestone {milestone}</span>
                  <span className="pointer-events-none absolute -top-2 -left-2 text-sm sparkle-1">✨</span>
                  <span className="pointer-events-none absolute -top-1 -right-3 text-xs sparkle-2">✨</span>
                  <span className="pointer-events-none absolute -bottom-2 left-2 text-xs sparkle-3">✨</span>
                </span>
              )}
            </div>
            {drama.watchedWithGlassimo && (
              <p className="text-sm">
                🥂 <span className="font-semibold">Watched with Glassimo</span>
              </p>
            )}
            {/* Cast carousel - reactions locked (read-only in detail view) */}
            {cast.length > 0 && (
              <CastCarousel cast={cast} onReact={handleActorReact} readOnly />
            )}
            {drama.favoriteCharacters && (
              <p className="text-sm">
                <span className="font-semibold">Favorite Characters:</span>{" "}
                {drama.favoriteCharacters}
              </p>
            )}
            {drama.favoriteSongs && (
              <p className="text-sm">
                <span className="font-semibold">🎵 OST:</span>{" "}
                {drama.favoriteSongs}
              </p>
            )}
            {(drama.osts ?? []).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">🎵 OSTs</p>
                <div className="space-y-2">
                  {(drama.osts ?? []).map((t) => {
                    const card = (
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 pr-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                          {t.cover ? (
                            <img src={t.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <Music size={18} className="m-auto text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{t.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{t.artist}</p>
                        </div>
                      </div>
                    );
                    return t.url ? (
                      <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">{card}</a>
                    ) : (
                      <div key={t.id}>{card}</div>
                    );
                  })}
                </div>
              </div>
            )}
            {drama.secondLeadSyndrome && (
              <p className="text-sm">💔 Had Second Lead Syndrome 😭</p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-4">
          Added on{" "}
          {new Date(drama.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </main>
    </div>
  );
}
