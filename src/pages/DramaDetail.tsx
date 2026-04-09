import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { getDrama, saveDrama, deleteDrama } from "@/lib/store";
import { StarRating } from "@/components/StarRating";
import { Navbar } from "@/components/Navbar";
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

  const Section = ({ title, content }: { title: string; content: string }) =>
    content ? (
      <div className="glass-card rounded-2xl p-6 space-y-2 animate-fade-in">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    ) : null;

  const statusLabel: Record<string, string> = {
    watching: "📺 Watching",
    completed: "✅ Completed",
    dropped: "❌ Dropped",
  };

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
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                {statusLabel[drama.status]}
              </span>
              {drama.platform && (
                <span className="px-3 py-1 rounded-full bg-lavender text-accent-foreground">{drama.platform}</span>
              )}
              {drama.episodes > 0 && (
                <span className="px-3 py-1 rounded-full bg-blush text-accent-foreground">{drama.episodes} episodes</span>
              )}
            </div>
            {drama.actors.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Cast:</span> {drama.actors.join(", ")}
              </p>
            )}
            {drama.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {drama.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground">
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
          <Section title="💬 Favorite Quote" content={drama.favoriteQuote} />
          <Section title="💗 What I Loved" content={drama.whatILiked} />
          <Section title="✍️ My Review" content={drama.review} />
        </div>

        <p className="text-xs text-muted-foreground text-center pt-4">
          Added on {new Date(drama.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </main>
    </div>
  );
}
