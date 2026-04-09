import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDramas } from '@/lib/store';
import StarRating from '@/components/StarRating';
import { Trophy } from 'lucide-react';

export default function Ranking() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'top'>('all');
  const dramas = getDramas();

  const ranked = useMemo(() => {
    let list = dramas;
    if (filter === 'completed') list = list.filter(d => d.status === 'completed');
    if (filter === 'top') list = list.filter(d => d.rating >= 4);
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [dramas, filter]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Trophy size={24} className="text-gold" /> Ranking
        </h1>
        <p className="text-sm text-muted-foreground">Your top-rated dramas</p>
      </div>

      <div className="flex justify-center gap-2">
        {(['all', 'completed', 'top'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All' : f === 'completed' ? 'Completed' : 'Top Rated'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {ranked.map((drama, i) => (
          <Link
            key={drama.id}
            to={`/drama/${drama.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="text-2xl w-8 text-center">{medals[i] ?? `#${i + 1}`}</span>
            <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              {drama.coverImage ? (
                <img src={drama.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">🎬</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-bold text-foreground truncate">{drama.title}</h3>
              <StarRating rating={drama.rating} size={12} />
            </div>
          </Link>
        ))}
        {ranked.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">No dramas to rank yet</p>
        )}
      </div>
    </div>
  );
}
