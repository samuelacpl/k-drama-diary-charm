interface EpisodeProgressProps {
  watched: number;
  total: number;
}

export default function EpisodeProgress({ watched, total }: EpisodeProgressProps) {
  if (total <= 0) return null;
  const pct = Math.min(100, (watched / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Ep. {watched} / {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lavender to-rose transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
