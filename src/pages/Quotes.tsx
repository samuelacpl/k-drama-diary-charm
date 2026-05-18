import { useMemo, useState, useEffect, useRef } from "react";
import { useDramas } from "@/hooks/useDramas";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Quote, Loader2, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";

export default function Quotes() {
  const { data: dramas = [], isLoading } = useDramas();

  const [tab, setTab] = useState<"list" | "inspo">("list");

  const allQuotes = useMemo(() => {
    return dramas.flatMap((d) => {
      const quotes = d.favoriteQuotes ?? [];
      if (quotes.length === 0 && d.favoriteQuote) {
        return [{ text: d.favoriteQuote, dramaId: d.id, dramaTitle: d.title, cover: d.coverImage, year: new Date(d.createdAt).getFullYear() }];
      }
      return quotes.map((q) => ({
        text: q,
        dramaId: d.id,
        dramaTitle: d.title,
        cover: d.coverImage,
        year: new Date(d.createdAt).getFullYear(),
      }));
    });
  }, [dramas]);

  const PAGE = 20;
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => setVisible(PAGE), [allQuotes.length]);
  useEffect(() => {
    if (tab !== "list") return;
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        setVisible((v) => Math.min(v + PAGE, allQuotes.length));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [allQuotes.length, tab]);

  // ===== Inspo (Tinder-like) state =====
  const [inspoIdx, setInspoIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const [exiting, setExiting] = useState<null | "left" | "right">(null);
  const recent = useRef<number[]>([]);
  const startX = useRef<number | null>(null);

  const pickRandom = () => {
    if (allQuotes.length <= 1) return 0;
    let n = inspoIdx;
    let tries = 0;
    do {
      n = Math.floor(Math.random() * allQuotes.length);
      tries++;
    } while (
      tries < 12 &&
      (n === inspoIdx || recent.current.includes(n))
    );
    recent.current.push(n);
    if (recent.current.length > Math.min(5, allQuotes.length - 1)) recent.current.shift();
    return n;
  };

  const swipe = (dir: "left" | "right") => {
    setExiting(dir);
    setTimeout(() => {
      setInspoIdx(pickRandom());
      setDrag(0);
      setExiting(null);
    }, 220);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    setDrag(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (Math.abs(drag) > 90) swipe(drag > 0 ? "right" : "left");
    else setDrag(0);
    startX.current = null;
  };

  const current = allQuotes[inspoIdx];
  const translate = exiting
    ? exiting === "right" ? "translateX(120%) rotate(12deg)" : "translateX(-120%) rotate(-12deg)"
    : `translateX(${drag}px) rotate(${drag / 24}deg)`;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-2xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            💬 Quotes
          </h1>
          <p className="text-sm text-muted-foreground">
            Your favorite lines from every drama
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2">
          {([
            { v: "list", label: "📜 All" },
            { v: "inspo", label: "🔥 Inspo" },
          ] as const).map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                tab === t.v
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-2" size={32} />
            <p className="text-xs text-muted-foreground">
              Retrieving your favorite quotes...
            </p>
          </div>
        ) : allQuotes.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Quote size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No quotes yet! Add some favorite quotes when editing a drama.
            </p>
          </div>
        ) : tab === "list" ? (
          <div className="space-y-3">
            {allQuotes.slice(0, visible).map((q, i) => (
              <div
                key={`${q.dramaId}-${i}`}
                className="glass-card rounded-2xl p-5 space-y-2 animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
              >
                <blockquote className="text-sm italic text-foreground border-l-4 border-primary/30 pl-4">
                  "{q.text}"
                </blockquote>
                <Link
                  to={`/drama/${q.dramaId}`}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  — {q.dramaTitle}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4 select-none">
            <div className="relative w-full max-w-sm h-[420px]">
              {current && (
                <div
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  style={{
                    transform: translate,
                    transition: exiting || startX.current === null ? "transform 0.22s ease-out" : "none",
                    touchAction: "pan-y",
                  }}
                  className="absolute inset-0 glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-5 cursor-grab active:cursor-grabbing shadow-lg"
                >
                  <Quote size={28} className="text-primary/60" />
                  <blockquote className="font-display text-xl sm:text-2xl italic leading-relaxed text-foreground line-clamp-[10]">
                    "{current.text}"
                  </blockquote>
                  <Link
                    to={`/drama/${current.dramaId}`}
                    className="flex items-center gap-3 mt-auto pt-4"
                  >
                    {current.cover && (
                      <img
                        src={current.cover}
                        alt=""
                        className="w-10 h-14 object-cover rounded-lg border border-border"
                        loading="lazy"
                      />
                    )}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{current.dramaTitle}</p>
                      <p className="text-xs text-muted-foreground">{current.year}</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => swipe("left")}
                className="p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => swipe("right")}
                className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
                aria-label="Next"
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={() => swipe("right")}
                className="p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">Swipe or tap to discover a new quote ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}
