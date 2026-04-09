import { Minus, Plus } from 'lucide-react';

interface EpisodeStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export default function EpisodeStepper({ value, max, onChange }: EpisodeStepperProps) {
  const clamp = (v: number) => Math.max(0, Math.min(max || 9999, v));

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 0}
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground transition-all hover:bg-blush/20 hover:border-rose active:scale-95 disabled:opacity-30 disabled:hover:bg-card"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[3rem] text-center text-lg font-semibold text-foreground">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= (max || 9999)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground transition-all hover:bg-lavender/20 hover:border-lavender active:scale-95 disabled:opacity-30 disabled:hover:bg-card"
      >
        <Plus size={16} />
      </button>
      {max > 0 && (
        <span className="text-sm text-muted-foreground">/ {max}</span>
      )}
    </div>
  );
}
