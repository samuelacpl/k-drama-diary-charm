export type DramaStatus = "watching" | "completed" | "dropped";

export interface Drama {
  id: string;
  title: string;
  platform: string;
  episodes: number;
  status: DramaStatus;
  coverImage: string;
  actors: string[];
  favoriteQuote: string;
  plot: string;
  whatILiked: string;
  review: string;
  rating: number;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}
