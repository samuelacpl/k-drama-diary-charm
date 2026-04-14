const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

export function posterUrl(path: string | null, size = 'w342') {
  return path ? `${IMG}/${size}${path}` : '';
}

export function profileUrl(path: string | null, size = 'w185') {
  return path ? `${IMG}/${size}${path}` : '';
}

export interface TmdbSearchResult {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
  genre_ids: number[];
  number_of_seasons?: number;
}

export interface TmdbDetail {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

const GENRE_MAP: Record<number, string> = {
  10759: 'Action', 10762: 'Slice of Life', 10763: 'Thriller', 10764: 'Comedy',
  10765: 'Fantasy', 10766: 'Romance', 10768: 'Thriller', 16: 'Fantasy',
  18: 'Melodrama', 35: 'Comedy', 37: 'Historical', 80: 'Thriller',
  99: 'Slice of Life', 9648: 'Thriller', 10751: 'Slice of Life',
};

export function mapGenres(genreIds: number[]): string[] {
  const mapped = genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
  return [...new Set(mapped)];
}

export async function searchDramas(query: string): Promise<TmdbSearchResult[]> {
  if (!API_KEY || !query.trim()) return [];
  try {
    const res = await fetch(`${BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 8);
  } catch {
    return [];
  }
}

export async function getDramaDetails(tmdbId: number): Promise<TmdbDetail | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(`${BASE}/tv/${tmdbId}?api_key=${API_KEY}&language=en-US`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getDramaCast(tmdbId: number): Promise<TmdbCastMember[]> {
  if (!API_KEY) return [];
  try {
    const res = await fetch(`${BASE}/tv/${tmdbId}/credits?api_key=${API_KEY}&language=en-US`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.cast ?? []).slice(0, 10);
  } catch {
    return [];
  }
}

export function hasTmdbKey(): boolean {
  return !!API_KEY && API_KEY !== 'YOUR_TMDB_API_KEY_HERE';
}
