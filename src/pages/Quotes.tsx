import { getDramas } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';

export default function Quotes() {
  const dramas = getDramas();
  const allQuotes = dramas.flatMap(d => {
    const quotes = d.favoriteQuotes ?? [];
    // Backward compat: include old single quote if no array
    if (quotes.length === 0 && d.favoriteQuote) {
      return [{ text: d.favoriteQuote, dramaId: d.id, dramaTitle: d.title }];
    }
    return quotes.map(q => ({ text: q, dramaId: d.id, dramaTitle: d.title }));
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-2xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">💬 Quotes</h1>
          <p className="text-sm text-muted-foreground">Your favorite lines from every drama</p>
        </div>

        {allQuotes.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Quote size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No quotes yet! Add some favorite quotes when editing a drama.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allQuotes.map((q, i) => (
              <div key={`${q.dramaId}-${i}`} className="glass-card rounded-2xl p-5 space-y-2 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                <blockquote className="text-sm italic text-foreground border-l-4 border-primary/30 pl-4">
                  "{q.text}"
                </blockquote>
                <Link to={`/drama/${q.dramaId}`} className="text-xs text-primary font-medium hover:underline">
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
