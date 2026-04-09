export interface Drama {
  id: string;
  title: string;
  platform: string;
  totalEpisodes: number;
  episodesWatched: number;
  status: 'watching' | 'completed' | 'dropped' | 'plan-to-watch';
  coverImage: string;
  actors: string;
  favoriteQuote: string;
  plot: string;
  whatILiked: string;
  review: string;
  rating: number;
  tags: string[];
  emotionalTags: string[];
  favoriteCharacters: string;
  favoriteSongs: string;
  secondLeadSyndrome: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PLATFORMS = ['Netflix', 'Viki', 'Disney+', 'TVING', 'Wavve', 'iQIYI', 'WeTV', 'Kocowa', 'Other'];

export const GENRE_TAGS = [
  'Romance', 'Thriller', 'Historical', 'Comedy', 'Fantasy',
  'Slice of Life', 'Melodrama', 'Action', 'Mystery', 'Horror',
  'Slow Burn', 'Love Triangle', 'Enemies to Lovers', 'Office Romance',
  'Medical', 'Legal', 'School', 'Sci-Fi',
];

export const EMOTIONAL_TAGS = [
  { emoji: '❤️', label: 'Loved it' },
  { emoji: '😭', label: 'Made me cry' },
  { emoji: '🔥', label: 'Obsessed' },
  { emoji: '😴', label: 'Boring' },
  { emoji: '🦋', label: 'Butterflies' },
  { emoji: '💔', label: 'Heartbroken' },
];

export const STATUS_OPTIONS = [
  { value: 'watching' as const, label: 'Watching', color: 'sage' },
  { value: 'completed' as const, label: 'Completed', color: 'lavender' },
  { value: 'dropped' as const, label: 'Dropped', color: 'blush' },
  { value: 'plan-to-watch' as const, label: 'Plan to Watch', color: 'cream' },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (dramas: Drama[]) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'First Entry', description: 'Added your first drama', emoji: '🌸', check: (d) => d.length >= 1 },
  { id: 'five', title: 'Getting Started', description: 'Added 5 dramas', emoji: '🎬', check: (d) => d.length >= 5 },
  { id: 'ten', title: 'Binge Watcher', description: 'Added 10 dramas', emoji: '📺', check: (d) => d.length >= 10 },
  { id: 'perfect', title: 'Masterpiece', description: 'Gave a drama 5 stars', emoji: '⭐', check: (d) => d.some(x => x.rating === 5) },
  { id: 'crybaby', title: 'Crybaby', description: 'Cried watching 3 dramas', emoji: '😭', check: (d) => d.filter(x => x.emotionalTags.includes('😭')).length >= 3 },
  { id: 'romantic', title: 'Hopeless Romantic', description: 'Watched 3 romance dramas', emoji: '💕', check: (d) => d.filter(x => x.tags.includes('Romance')).length >= 3 },
  { id: 'diverse', title: 'Genre Explorer', description: 'Watched 5 different genres', emoji: '🎭', check: (d) => new Set(d.flatMap(x => x.tags)).size >= 5 },
  { id: 'completed5', title: 'Completionist', description: 'Completed 5 dramas', emoji: '🏆', check: (d) => d.filter(x => x.status === 'completed').length >= 5 },
  { id: 'obsessed', title: 'K-Drama Addict', description: 'Marked 3 dramas as Obsessed', emoji: '🔥', check: (d) => d.filter(x => x.emotionalTags.includes('🔥')).length >= 3 },
  { id: 'marathon', title: 'Marathon Runner', description: 'Watched 100+ total episodes', emoji: '🏃', check: (d) => d.reduce((s, x) => s + x.episodesWatched, 0) >= 100 },
];
