import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { getDrama, saveDrama, deleteDrama } from "@/lib/store";
import { StarRating } from "@/components/StarRating";
import EmotionalBadges from "@/components/EmotionalBadges";
import { Navbar } from "@/components/Navbar";
import QuotesSlider from "@/components/QuotesSlider";
import ActorCard from "@/components/ActorCard";
import { useState } from "react";
import { Drama } from "@/lib/types";

export default function DramaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drama, setDrama] = useState<Drama | undefined>(() => getDrama(id || ""));

  if (!drama) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Drama not found 😢</p>
          <Link to="/" className="text-primary font-semibold mt-4 inline-block">Go home</Link>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    const updated = { ...drama, isFavorite: !drama.isFavorite };
    saveDrama(updated);
    setDrama(updated);
  };

  const handleDelete = () => {
    if (confirm("Delete this drama from your diary?")) {
      deleteDrama(drama.id);
      navigate("/");
    }
  };

  const handleActorReact = (actorId: number, reaction: 'loved' | 'hated') => {
    const updatedCast = (drama.cast ?? []).map(a =>
      a.id === actorId ? { ...a, reaction: a.reaction === reaction ? undefined : reaction } : a
    );
    const updated = { ...drama, cast: updatedCast };
    saveDrama(updated);
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
  const quotes = drama.favoriteQuotes?.length ? drama.favoriteQuotes : (drama.favoriteQuote ? [drama.favoriteQuote] : []);

  const progressPct = (drama.totalEpisodes ?? 0) > 0
    ? Math.round(((drama.episodesWatched ?? 0) / drama.totalEpisodes) * 100)
    : 0;

  const Section = ({ title, content }: { title: string; content?: string }) =>
    content ? (
      <div className="glass-card rounded-2xl p-6 space-y-2 animate-fade-in">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    ) : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-3xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex gap-2">
            <Link to={`/drama/${drama.id}/edit`} className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
              <Edit size={20} />
            </Link>
            <button onClick={toggleFavorite} className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Heart size={20} className={drama.isFavorite ? "fill-rose text-rose" : "text-muted-foreground"} />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-destructive/10 transition-colors text-destructive">
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
            <h1 className="font-display text-3xl sm:text-4xl font-semibold">{drama.title}</h1>
            <StarRating rating={drama.rating} readonly size={22} />

            {emotionalTags.length > 0 && (
              <EmotionalBadges selected={emotionalTags} size="md" />
            )}

            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                {statusLabel[drama.status]}
              </span>
              {drama.platform && (
                <span className="px-3 py-1 rounded-full bg-lavender text-accent-foreground">{drama.platform}</span>
              )}
              {drama.watchedWithGlassimo && (
                <span className="px-3 py-1 rounded-full bg-gold/20 text-foreground">🥂 With Glassimo</span>
              )}
            </div>

            {(drama.totalEpisodes ?? 0) > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Ep. {drama.episodesWatched ?? 0}/{drama.totalEpisodes}</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}

            {drama.actors && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Cast:</span> {drama.actors}
              </p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cast Carousel */}
        {cast.length > 0 && (
          <CastCarousel cast={cast} onReact={handleActorReact} />
        )}

        {/* Sections */}
        <div className="space-y-4">
          <Section title="📖 Plot" content={drama.plot} />

          {/* Quotes Slider */}
          {quotes.length > 0 && <QuotesSlider quotes={quotes} />}

          <Section title="💗 What I Loved" content={drama.whatILiked} />
          <Section title="✍️ My Review" content={drama.review} />
          {drama.watchedWithGlassimo && drama.glassimoReview && (
            <Section title="🥂 Glassimo Review" content={drama.glassimoReview} />
          )}
        </div>

        {/* Watching It Images */}
        {watchingImages.length > 0 && (
          <div className="glass-card rounded-2xl p-6 space-y-3 animate-fade-in">
            <h3 className="font-display text-lg font-semibold">📸 Watching It</h3>
            <div className="grid grid-cols-2 gap-3">
              {watchingImages.map(img => (
                <div key={img.id} className="rounded-xl overflow-hidden border border-border">
                  <img src={img.dataUrl} alt={img.comment || ''} className="w-full aspect-square object-cover" />
                  {img.comment && (
                    <p className="p-2 text-xs text-muted-foreground">{img.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fan Corner */}
        {(drama.favoriteCharacters || drama.favoriteSongs || drama.secondLeadSyndrome) && (
          <div className="glass-card rounded-2xl p-6 space-y-3 animate-fade-in">
            <h3 className="font-display text-lg font-semibold">🧸 Fan Corner</h3>
            {drama.favoriteCharacters && <p className="text-sm"><span className="font-semibold">Favorite Characters:</span> {drama.favoriteCharacters}</p>}
            {drama.favoriteSongs && <p className="text-sm"><span className="font-semibold">🎵 OST:</span> {drama.favoriteSongs}</p>}
            {drama.secondLeadSyndrome && <p className="text-sm">💔 Had Second Lead Syndrome 😭</p>}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-4">
          Added on {new Date(drama.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </main>
    </div>
  );
}
