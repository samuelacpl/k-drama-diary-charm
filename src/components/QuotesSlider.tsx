import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuotesSliderProps {
  quotes: string[];
}

export default function QuotesSlider({ quotes }: QuotesSliderProps) {
  const [idx, setIdx] = useState(0);
  if (quotes.length === 0) return null;

  const prev = () => setIdx(i => (i - 1 + quotes.length) % quotes.length);
  const next = () => setIdx(i => (i + 1) % quotes.length);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-3 animate-fade-in">
      <h3 className="font-display text-lg font-semibold">💬 Favorite Quotes</h3>
      <div className="flex items-center gap-3">
        {quotes.length > 1 && (
          <button onClick={prev} className="p-1.5 rounded-full hover:bg-secondary transition-colors shrink-0">
            <ChevronLeft size={18} className="text-muted-foreground" />
          </button>
        )}
        <blockquote className="flex-1 text-sm italic text-muted-foreground border-l-4 border-primary/30 pl-4 transition-all duration-300">
          "{quotes[idx]}"
        </blockquote>
        {quotes.length > 1 && (
          <button onClick={next} className="p-1.5 rounded-full hover:bg-secondary transition-colors shrink-0">
            <ChevronRight size={18} className="text-muted-foreground" />
          </button>
        )}
      </div>
      {quotes.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {quotes.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
