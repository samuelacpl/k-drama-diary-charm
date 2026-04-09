import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Drama, DramaStatus } from "@/lib/types";
import { saveDrama } from "@/lib/store";
import { StarRating } from "@/components/StarRating";
import { Navbar } from "@/components/Navbar";

const PLATFORMS = ["Netflix", "Viki", "Disney+", "TVING", "Wavve", "WeTV", "iQIYI", "Other"];
const STATUS_OPTIONS: { value: DramaStatus; label: string }[] = [
  { value: "watching", label: "📺 Watching" },
  { value: "completed", label: "✅ Completed" },
  { value: "dropped", label: "❌ Dropped" },
];

export default function AddDrama() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    platform: "",
    episodes: "",
    status: "watching" as DramaStatus,
    coverImage: "",
    actors: "",
    favoriteQuote: "",
    plot: "",
    whatILiked: "",
    review: "",
    rating: 0,
    tags: "",
  });

  const set = (key: string, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const drama: Drama = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      platform: form.platform,
      episodes: Number(form.episodes) || 0,
      status: form.status,
      coverImage: form.coverImage.trim(),
      actors: form.actors.split(",").map((a) => a.trim()).filter(Boolean),
      favoriteQuote: form.favoriteQuote.trim(),
      plot: form.plot.trim(),
      whatILiked: form.whatILiked.trim(),
      review: form.review.trim(),
      rating: form.rating,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    saveDrama(drama);
    navigate(`/drama/${drama.id}`);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-2xl py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="font-display text-3xl font-semibold mb-8">Add New Drama ✨</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Crash Landing on You" className={inputClass} required />
          </div>

          {/* Platform + Episodes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Platform</label>
              <select value={form.platform} onChange={(e) => set("platform", e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Episodes</label>
              <input type="number" value={form.episodes} onChange={(e) => set("episodes", e.target.value)} placeholder="16" className={inputClass} min="0" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Status</label>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("status", value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    form.status === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Cover Image URL</label>
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://..." className={inputClass} />
            {form.coverImage && (
              <div className="mt-3 relative w-32">
                <img src={form.coverImage} alt="Preview" className="w-32 h-48 object-cover rounded-xl border border-border" />
                <button type="button" onClick={() => set("coverImage", "")} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Rating</label>
            <StarRating rating={form.rating} onChange={(r) => set("rating", r)} size={28} />
          </div>

          {/* Actors */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Main Actors</label>
            <input value={form.actors} onChange={(e) => set("actors", e.target.value)} placeholder="Comma-separated: Hyun Bin, Son Ye-jin" className={inputClass} />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Tags</label>
            <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="romance, historical, thriller" className={inputClass} />
          </div>

          {/* Text areas */}
          {[
            { key: "plot", label: "Plot / Summary", placeholder: "What's the story about?" },
            { key: "favoriteQuote", label: "Favorite Quote 💬", placeholder: "That one line that stuck with you..." },
            { key: "whatILiked", label: "What I Loved 💗", placeholder: "The chemistry, the OST, the twist..." },
            { key: "review", label: "My Review ✍️", placeholder: "Your personal thoughts..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1.5">{label}</label>
              <textarea
                value={form[key as keyof typeof form] as string}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:opacity-90 transition">
              Save Drama 🌸
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-accent transition">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
