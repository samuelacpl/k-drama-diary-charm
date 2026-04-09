export type WatchStatus = 'Watching' | 'Completed' | 'Dropped' | 'Plan to Watch';

export interface Drama {
  id: string;
  title: string;
  posterUrl: string;
  platform: string;
  episodes: number;
  currentEpisode: number;
  status: DramaStatus;
  emotions: string[]; // ['❤️', '😭', '🔥']
  coverImage: string;
  actors: string[];
  favoriteQuote: string;
  plot: string;
  whatILiked: string;
  review?: string;
  rating: number; // 0-5
  tags: string[];
  genres: string[];
  isFavorite: boolean;
  hasSLS: boolean; // Second Lead Syndrome
  createdAt: string;
}
