import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
}

export default function StarRating({ rating, onChange, size = 20 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className="transition-transform hover:scale-110 disabled:cursor-default"
        >
          <Star
            size={size}
            className={star <= rating ? 'fill-gold text-gold' : 'text-muted'}
          />
        </button>
      ))}
    </div>
  );
}
