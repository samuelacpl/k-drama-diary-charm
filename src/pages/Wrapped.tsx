import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Loader } from "@/components/Loader";
import { useDramas } from "@/hooks/useDramas";
import { Drama } from "@/lib/types";
import { profileUrl } from "@/lib/tmdb";
import { ChevronLeft, ChevronRight, Sparkles, Music, Heart, Tv, Camera, Star } from "lucide-react";

interface Slide {
  key: string;
  bg: string;
  content: JSX.Element;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function buildSlides(dramas: Drama[], key: string): Slide[] {
  const slides: Slide[] = [];
  const label = monthLabel(key);

  // Intro
  slides.push({
    key: "intro",
    bg: "from-blush via-cream to-lavender/60",
    content: (
      <div className="text-center space-y-4 px-6">
        <Sparkles className="mx-auto text-primary" size={48} />
        <h2 className="font-display text-4xl font-bold text-foreground">{label}</h2>
        <p className="text-lg italic text-muted-foreground">Your K-Drama wrapped ✨</p>
        <p className="text-xs text-muted-foreground/70">{dramas.length} drama{dramas.length === 1 ? "" : "s"} this month</p>
      </div>
    ),
  });

  // Most watched
  const mostWatched = [...dramas].sort((a, b) => (b.episodesWatched ?? 0) - (a.episodesWatched ?? 0))[0];
  if (mostWatched) {
    slides.push({
      key: "most",
      bg: "from-cream via-blush/60 to-rose/30",
      content: (
        <div className="text-center space-y-3 px-6">
          <Tv className="mx-auto text-primary" size={32} />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Most watched</p>
          {mostWatched.coverImage && (
            <img src={mostWatched.coverImage} alt="" className="w-32 mx-auto aspect-[2/3] rounded-2xl object-cover border border-border shadow-md" />
          )}
          <h3 className="font-display text-2xl font-semibold text-foreground">{mostWatched.title}</h3>
          <p className="text-xs text-muted-foreground">{mostWatched.episodesWatched} episodes watched 📺</p>
        </div>
      ),
    });
  }

  // Top rated / comfort
  const topRated = [...dramas].filter(d => d.rating >= 4).sort((a, b) => b.rating - a.rating)[0];
  if (topRated) {
    slides.push({
      key: "top",
      bg: "from-lavender/60 via-cream to-blush/40",
      content: (
        <div className="text-center space-y-3 px-6">
          <Star className="mx-auto text-gold" size={32} />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your comfort drama</p>
          {topRated.coverImage && (
            <img src={topRated.coverImage} alt="" className="w-32 mx-auto aspect-[2/3] rounded-2xl object-cover border border-border shadow-md" />
          )}
          <h3 className="font-display text-2xl font-semibold text-foreground">{topRated.title}</h3>
          <p className="text-sm">{"⭐".repeat(topRated.rating)}</p>
        </div>
      ),
    });
  }

  // Cried the most
  const criers = dramas.filter(d => (d.emotionalTags ?? []).includes("😭"));
  if (criers.length > 0) {
    const sad = criers[0];
    slides.push({
      key: "cry",
      bg: "from-sky/40 via-cream to-lavender/40",
      content: (
        <div className="text-center space-y-3 px-6">
          <p className="text-4xl">😭</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">You cried the most watching…</p>
          {sad.coverImage && (
            <img src={sad.coverImage} alt="" className="w-28 mx-auto aspect-[2/3] rounded-2xl object-cover border border-border shadow-md" />
          )}
          <h3 className="font-display text-xl font-semibold text-foreground">{sad.title}</h3>
        </div>
      ),
    });
  }

  // Favorite OST
  const ost = dramas.flatMap(d => (d.osts ?? []).map(t => ({ ...t, drama: d.title })))[0];
  if (ost) {
    slides.push({
      key: "ost",
      bg: "from-primary/30 via-cream to-blush/40",
      content: (
        <div className="text-center space-y-3 px-6">
          <Music className="mx-auto text-primary" size={32} />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Favorite OST discovered</p>
          {ost.cover && <img src={ost.cover} alt="" className="w-28 h-28 mx-auto rounded-2xl object-cover border border-border shadow-md" />}
          <h3 className="font-display text-lg font-semibold text-foreground">{ost.name}</h3>
          <p className="text-xs text-muted-foreground">{ost.artist} · from {ost.drama}</p>
        </div>
      ),
    });
  }

  // Favorite quote
  const quoteSrc = dramas.find(d => (d.favoriteQuotes ?? []).length > 0 || d.favoriteQuote);
  if (quoteSrc) {
    const q = (quoteSrc.favoriteQuotes ?? [])[0] || quoteSrc.favoriteQuote;
    slides.push({
      key: "quote",
      bg: "from-cream via-lavender/40 to-blush/40",
      content: (
        <div className="text-center space-y-4 px-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Quote of the month</p>
          <blockquote className="font-display text-xl italic leading-relaxed text-foreground">“{q}”</blockquote>
          <p className="text-xs text-primary font-semibold">— {quoteSrc.title}</p>
        </div>
      ),
    });
  }

  // Second lead crush
  const sl = dramas.find(d => d.secondLeadSyndrome && d.secondLeadActorId);
  if (sl) {
    const a = (sl.cast ?? []).find(c => c.id === sl.secondLeadActorId);
    if (a) {
      const img = a.profilePath?.startsWith("http") ? a.profilePath : profileUrl(a.profilePath);
      slides.push({
        key: "sl",
        bg: "from-rose/40 via-cream to-blush/30",
        content: (
          <div className="text-center space-y-3 px-6">
            <Heart className="mx-auto text-rose" size={32} />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Second lead that stole your heart 💔</p>
            {img && <img src={img} alt={a.name} className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-rose shadow-md" />}
            <h3 className="font-display text-xl font-semibold text-foreground">{a.name}</h3>
            <p className="text-xs text-muted-foreground">as {a.character} · {sl.title}</p>
          </div>
        ),
      });
    }
  }

  // Gallery memories
  const photos = dramas.flatMap(d => (d.watchingImages ?? []).map(i => ({ ...i, drama: d.title }))).slice(0, 6);
  if (photos.length > 0) {
    slides.push({
      key: "gallery",
      bg: "from-cream via-blush/30 to-lavender/40",
      content: (
        <div className="text-center space-y-3 px-4 w-full">
          <Camera className="mx-auto text-primary" size={28} />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Gallery memories</p>
          <div className="grid grid-cols-3 gap-2 px-4">
            {photos.map(p => (
              <img key={p.id} src={p.dataUrl} alt="" className="w-full aspect-square object-cover rounded-xl border border-border" />
            ))}
          </div>
        </div>
      ),
    });
  }

  // Rewatched
  const rew = dramas.find(d => (d.rewatches ?? []).length > 0);
  if (rew) {
    slides.push({
      key: "rew",
      bg: "from-blush/40 via-cream to-primary/20",
      content: (
        <div className="text-center space-y-3 px-6">
          <p className="text-4xl">🔁</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Rewatched this month</p>
          {rew.coverImage && <img src={rew.coverImage} alt="" className="w-28 mx-auto aspect-[2/3] rounded-2xl object-cover border border-border shadow-md" />}
          <h3 className="font-display text-xl font-semibold text-foreground">{rew.title}</h3>
          <p className="text-xs text-muted-foreground">{rew.rewatches?.length ?? 0} times 💕</p>
        </div>
      ),
    });
  }

  // Totals
  const totalEps = dramas.reduce((s, d) => s + (d.episodesWatched ?? 0), 0);
  slides.push({
    key: "totals",
    bg: "from-primary/20 via-blush/30 to-lavender/40",
    content: (
      <div className="text-center space-y-4 px-6">
        <Sparkles className="mx-auto text-primary" size={32} />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">By the numbers</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card/70 p-4 border border-border">
            <p className="font-display text-3xl font-bold text-foreground">{dramas.length}</p>
            <p className="text-[11px] text-muted-foreground">dramas</p>
          </div>
          <div className="rounded-2xl bg-card/70 p-4 border border-border">
            <p className="font-display text-3xl font-bold text-foreground">{totalEps}</p>
            <p className="text-[11px] text-muted-foreground">episodes</p>
          </div>
          <div className="rounded-2xl bg-card/70 p-4 border border-border col-span-2">
            <p className="font-display text-2xl font-bold text-foreground">~{Math.round((totalEps * 60) / 60)}h</p>
            <p className="text-[11px] text-muted-foreground">of K-Drama love 💕</p>
          </div>
        </div>
      </div>
    ),
  });

  return slides;
}

export default function Wrapped() {
  const { data: dramas = [], isLoading } = useDramas();

  const months = useMemo(() => {
    const set = new Set<string>();
    dramas.forEach(d => {
      if (d.createdAt) set.add(monthKey(new Date(d.createdAt)));
    });
    const arr = Array.from(set).sort().reverse();
    if (arr.length === 0) arr.push(monthKey(new Date()));
    return arr;
  }, [dramas]);

  const [monthIdx, setMonthIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const currentMonth = months[monthIdx];

  const monthDramas = useMemo(() => {
    if (!currentMonth) return [];
    return dramas.filter(d => d.createdAt && monthKey(new Date(d.createdAt)) === currentMonth);
  }, [dramas, currentMonth]);

  const slides = useMemo(() => buildSlides(monthDramas, currentMonth ?? monthKey(new Date())), [monthDramas, currentMonth]);

  const goSlide = (delta: number) => {
    setSlideIdx(i => Math.min(slides.length - 1, Math.max(0, i + delta)));
  };

  // Swipe
  const startX = useState<{ x: number | null }>({ x: null })[0];
  const onDown = (e: React.PointerEvent) => { startX.x = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (startX.x === null) return;
    const dx = e.clientX - startX.x;
    if (Math.abs(dx) > 60) goSlide(dx < 0 ? 1 : -1);
    startX.x = null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Loader label="Wrapping up your year..." />
      </div>
    );
  }

  const slide = slides[slideIdx] ?? slides[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-md py-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setMonthIdx(i => Math.min(months.length - 1, i + 1)); setSlideIdx(0); }}
            disabled={monthIdx >= months.length - 1}
            className="p-2 rounded-full bg-card border border-border disabled:opacity-30">
            <ChevronLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">
            ✨ {currentMonth ? monthLabel(currentMonth) : ""} Wrapped
          </h1>
          <button
            onClick={() => { setMonthIdx(i => Math.max(0, i - 1)); setSlideIdx(0); }}
            disabled={monthIdx <= 0}
            className="p-2 rounded-full bg-card border border-border disabled:opacity-30">
            <ChevronRight size={18} />
          </button>
        </div>

        {monthDramas.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Sparkles size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No dramas added this month yet 💌</p>
          </div>
        ) : (
          <>
            <div
              onPointerDown={onDown}
              onPointerUp={onUp}
              className={`relative rounded-3xl bg-gradient-to-br ${slide.bg} shadow-lg border border-border/40 min-h-[460px] flex items-center justify-center overflow-hidden animate-fade-in select-none cursor-grab active:cursor-grabbing`}
              key={slide.key}
            >
              {slide.content}
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setSlideIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === slideIdx ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => goSlide(-1)} disabled={slideIdx === 0}
                className="p-3 rounded-full bg-card border border-border disabled:opacity-30">
                <ChevronLeft size={18} />
              </button>
              <p className="text-[11px] text-muted-foreground">swipe ←→ or use arrows</p>
              <button onClick={() => goSlide(1)} disabled={slideIdx === slides.length - 1}
                className="p-3 rounded-full bg-primary text-primary-foreground disabled:opacity-30">
                <ChevronRight size={18} />
              </button>
            </div>

            <p className="text-center text-[11px] text-muted-foreground/70">
              <Link to="/" className="hover:underline">← back to diary</Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}