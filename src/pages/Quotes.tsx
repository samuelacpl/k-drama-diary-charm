import { useMemo, useState, useEffect } from "react";
import { useDramas } from "@/hooks/useDramas";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Quote, Loader2 } from "lucide-react";

export default function Quotes() {
  const { data: dramas = [], isLoading } = useDramas();

  // 2. Elaborazione delle citazioni (si aggiorna quando 'dramas' cambia)
  const allQuotes = useMemo(() => {
    return dramas.flatMap((d) => {
      const quotes = d.favoriteQuotes ?? [];
      if (quotes.length === 0 && d.favoriteQuote) {
        return [{ text: d.favoriteQuote, dramaId: d.id, dramaTitle: d.title }];
      }
      return quotes.map((q) => ({
        text: q,
        dramaId: d.id,
        dramaTitle: d.title,
      }));
    });
  }, [dramas]);

  // Lazy rendering: rendiamo solo le prime N citazioni e ne aggiungiamo
  // altre quando l'utente scrolla vicino al fondo (smooth su mobile).
  const PAGE = 20;
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => setVisible(PAGE), [allQuotes.length]);
  useEffect(() => {
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
  }, [allQuotes.length]);

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

        {/* 3. Gestione stato caricamento UI */}
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
