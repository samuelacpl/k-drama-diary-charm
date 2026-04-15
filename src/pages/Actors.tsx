import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDramas } from '@/lib/store';
import { ActorInfo } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { profileUrl } from '@/lib/tmdb';
import { Users } from 'lucide-react';

interface ActorAggregate {
  id: number;
  name: string;
  profilePath: string;
  dramas: { id: string; title: string; character: string }[];
  lovedCount: number;
  hatedCount: number;
}

type SortOption = 'alpha' | 'loved' | 'watched';

export default function Actors() {
  const dramas = getDramas().filter(d => d.status !== 'plan-to-watch');
  const [sortBy, setSortBy] = useState<SortOption>('alpha');

  const actors = useMemo(() => {
    const map = new Map<number, ActorAggregate>();
    dramas.forEach(d => {
      (d.cast ?? []).forEach((a: ActorInfo) => {
        if (!map.has(a.id)) {
          map.set(a.id, { id: a.id, name: a.name, profilePath: a.profilePath, dramas: [], lovedCount: 0, hatedCount: 0 });
        }
        const agg = map.get(a.id)!;
        agg.dramas.push({ id: d.id, title: d.title, character: a.character });
        if (a.reaction === 'loved') agg.lovedCount++;
        if (a.reaction === 'hated') agg.hatedCount++;
      });
    });
    const list = Array.from(map.values());
    switch (sortBy) {
      case 'loved':
        return list.sort((a, b) => b.lovedCount - a.lovedCount || a.name.localeCompare(b.name));
      case 'watched':
        return list.sort((a, b) => b.dramas.length - a.dramas.length || a.name.localeCompare(b.name));
      case 'alpha':
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [dramas, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'alpha', label: 'A → Z' },
    { value: 'loved', label: '❤️ Most Loved' },
    { value: 'watched', label: '📺 Most Watched' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-3xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">🎭 Actors</h1>
          <p className="text-sm text-muted-foreground">{actors.length} actors across your dramas</p>
        </div>

        {/* Sorting */}
        {actors.length > 0 && (
          <div className="flex justify-center gap-2">
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => setSortBy(opt.value)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                  sortBy === opt.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {actors.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Users size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No actors yet! Add dramas with TMDb search to see actors here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {actors.map(actor => {
              const imgSrc = actor.profilePath?.startsWith('http')
                ? actor.profilePath
                : profileUrl(actor.profilePath);
              return (
                <Link key={actor.id} to={`/actor/${actor.id}`} className="glass-card rounded-2xl p-4 text-center space-y-2 animate-fade-in hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-border bg-muted">
                    {imgSrc ? (
                      <img src={imgSrc} alt={actor.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">🎭</div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{actor.name}</p>
                  <p className="text-xs text-muted-foreground">{actor.dramas.length} drama{actor.dramas.length > 1 ? 's' : ''}</p>
                  <div className="flex justify-center gap-2 text-xs">
                    {actor.lovedCount > 0 && <span>❤️ {actor.lovedCount}</span>}
                    {actor.hatedCount > 0 && <span>💀 {actor.hatedCount}</span>}
                  </div>
                  <div className="space-y-1">
                    {actor.dramas.map(d => (
                      <p key={d.id} className="text-[10px] text-muted-foreground truncate">
                        {d.title} — {d.character}
                      </p>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
