import { getDramas } from '@/lib/store';
import { ACHIEVEMENTS } from '@/lib/types';

export default function Stats() {
  const dramas = getDramas();
  const completed = dramas.filter(d => d.status === 'completed').length;
  const totalEps = dramas.reduce((s, d) => s + d.episodesWatched, 0);
  const avgRating = dramas.length ? (dramas.reduce((s, d) => s + d.rating, 0) / dramas.length).toFixed(1) : '0';
  const watchHours = Math.round(totalEps * 1.1); // ~1.1 hr per episode

  // Top genres
  const genreCount: Record<string, number> = {};
  dramas.forEach(d => d.tags.forEach(t => { genreCount[t] = (genreCount[t] || 0) + 1; }));
  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const unlocked = ACHIEVEMENTS.filter(a => a.check(dramas));

  const StatCard = ({ label, value, emoji }: { label: string; value: string | number; emoji: string }) => (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-5 text-center">
      <span className="text-3xl">{emoji}</span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div className="container max-w-2xl py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">📊 My Stats</h1>
        <p className="text-sm text-muted-foreground">Your K-Drama journey at a glance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Dramas" value={dramas.length} emoji="📺" />
        <StatCard label="Completed" value={completed} emoji="✅" />
        <StatCard label="Episodes" value={totalEps} emoji="🎬" />
        <StatCard label="Avg Rating" value={avgRating} emoji="⭐" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <span className="text-2xl">⏱️</span>
        <p className="text-lg font-bold text-foreground mt-1">~{watchHours} hours</p>
        <p className="text-xs text-muted-foreground">Estimated watch time</p>
      </div>

      {/* Top Genres */}
      {topGenres.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">🏷️ Top Genres</h2>
          <div className="space-y-2">
            {topGenres.map(([genre, count]) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-24 truncate">{genre}</span>
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-lavender to-rose"
                    style={{ width: `${(count / topGenres[0][1]) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-foreground">🏆 Achievements</h2>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.some(u => u.id === ach.id);
            return (
              <div
                key={ach.id}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                  isUnlocked ? 'border-gold/40 bg-gold/5' : 'border-border bg-card opacity-40'
                }`}
              >
                <span className="text-2xl">{ach.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{ach.title}</p>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
