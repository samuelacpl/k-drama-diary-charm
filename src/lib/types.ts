export type DramaStatus = 'watching' | 'completed' | 'dropped' | 'plan-to-watch';

export interface Drama {
  id: string;
  title: string;
  platform: string;
  totalEpisodes: number;
  episodesWatched: number;
  status: DramaStatus;
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
}

export const PLATFORMS = ['Netflix', 'Viki', 'Disney+', 'TVING', 'Wavve', 'WeTV', 'iQIYI', 'Other'];

export const GENRE_TAGS = [
  'Romance', 'Historical', 'Thriller', 'Comedy', 'Melodrama',
  'Fantasy', 'Sci-Fi', 'Slice of Life', 'Action', 'Horror',
  'Slow Burn', 'Love Triangle', 'Enemies to Lovers', 'Office Romance',
];

export const STATUS_OPTIONS: { value: DramaStatus; label: string; color: string }[] = [
  { value: 'watching', label: '📺 Watching', color: 'sage' },
  { value: 'completed', label: '✅ Completed', color: 'lavender' },
  { value: 'dropped', label: '❌ Dropped', color: 'rose' },
  { value: 'plan-to-watch', label: '📌 Plan to Watch', color: 'gold' },
];

export const EMOTIONAL_TAGS = [
  { emoji: '❤️', label: 'Loved it' },
  { emoji: '😭', label: 'Made me cry' },
  { emoji: '🔥', label: 'Obsessed' },
  { emoji: '😴', label: 'Boring' },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (dramas: Drama[]) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'First Steps', description: 'Added your first drama', emoji: '🌱', check: (d) => d.length >= 1 },
  { id: 'five', title: 'Getting Hooked', description: 'Added 5 dramas', emoji: '📺', check: (d) => d.length >= 5 },
  { id: 'ten', title: 'Binge Watcher', description: 'Added 10 dramas', emoji: '🍿', check: (d) => d.length >= 10 },
  { id: 'perfect', title: 'Perfection', description: 'Gave a 5-star rating', emoji: '⭐', check: (d) => d.some(x => x.rating === 5) },
  { id: 'crybaby', title: 'Crybaby', description: '3 dramas made you cry', emoji: '😭', check: (d) => d.filter(x => x.emotionalTags.includes('😭')).length >= 3 },
  { id: 'obsessed', title: 'Totally Obsessed', description: '3 dramas you were obsessed with', emoji: '🔥', check: (d) => d.filter(x => x.emotionalTags.includes('🔥')).length >= 3 },
  { id: 'romantic', title: 'Hopeless Romantic', description: '3 romance dramas completed', emoji: '💕', check: (d) => d.filter(x => x.status === 'completed' && x.tags.includes('Romance')).length >= 3 },
  { id: 'sls', title: 'SLS Survivor', description: 'Had Second Lead Syndrome', emoji: '💔', check: (d) => d.some(x => x.secondLeadSyndrome) },
  { id: 'marathon', title: 'Marathon Runner', description: 'Watched 100+ episodes total', emoji: '🏃', check: (d) => d.reduce((s, x) => s + x.episodesWatched, 0) >= 100 },
  { id: 'dropper', title: 'Life\'s Too Short', description: 'Dropped a drama', emoji: '🚪', check: (d) => d.some(x => x.status === 'dropped') },
];
