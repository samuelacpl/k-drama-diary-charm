import { EMOTIONAL_TAGS } from '@/lib/types';

interface EmotionalBadgesProps {
  selected: string[];
  onChange?: (tags: string[]) => void;
  size?: 'sm' | 'md';
}

export default function EmotionalBadges({ selected, onChange, size = 'sm' }: EmotionalBadgesProps) {
  if (!onChange) {
    if (selected.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1">
        {selected.map((emoji) => {
          const tag = EMOTIONAL_TAGS.find(t => t.emoji === emoji);
          return (
            <span key={emoji} className={`inline-flex items-center gap-0.5 rounded-full bg-blush/30 px-2 ${size === 'sm' ? 'py-0.5 text-xs' : 'py-1 text-sm'}`}>
              {emoji} {tag?.label}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONAL_TAGS.map((tag) => {
        const isSelected = selected.includes(tag.emoji);
        return (
          <button
            key={tag.emoji}
            type="button"
            onClick={() => {
              onChange(isSelected ? selected.filter(e => e !== tag.emoji) : [...selected, tag.emoji]);
            }}
            className={`flex items-center gap-1.5 rounded-2xl border-2 px-3 py-1.5 text-sm font-medium transition-all ${
              isSelected
                ? 'border-rose bg-rose/10 text-foreground scale-105'
                : 'border-border bg-card text-muted-foreground hover:border-rose/50'
            }`}
          >
            <span className="text-base">{tag.emoji}</span>
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
