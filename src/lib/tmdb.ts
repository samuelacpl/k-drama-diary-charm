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
  original_language?: string;
  origin_country?: string[];
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
    // Use Italian translations when available, fall back to original on empty fields.
    const res = await fetch(`${BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=it-IT&page=1&include_adult=false`);
    if (!res.ok) return [];
    const data = await res.json();
    // Filter: Korean content only (original_language === 'ko' OR origin_country includes 'KR')
    const filtered = (data.results ?? []).filter((r: TmdbSearchResult) =>
      r.original_language === 'ko' || (r.origin_country ?? []).includes('KR'),
    );
    return filtered.slice(0, 8);
  } catch {
    return [];
  }
}

export async function getDramaDetails(tmdbId: number): Promise<TmdbDetail | null> {
  if (!API_KEY) return null;
  try {
    // Italian first; if overview is missing, refetch in English and merge.
    const res = await fetch(`${BASE}/tv/${tmdbId}?api_key=${API_KEY}&language=it-IT`);
    if (!res.ok) return null;
    const it = await res.json();
    if (!it.overview || it.overview.trim() === '') {
      try {
        const enRes = await fetch(`${BASE}/tv/${tmdbId}?api_key=${API_KEY}&language=en-US`);
        if (enRes.ok) {
          const en = await enRes.json();
          it.overview = en.overview || '';
        }
      } catch { /* ignore */ }
    }
    return it;
  } catch {
    return null;
  }
}

export async function getDramaCast(tmdbId: number): Promise<TmdbCastMember[]> {
  if (!API_KEY) return [];
  try {
    const res = await fetch(`${BASE}/tv/${tmdbId}/credits?api_key=${API_KEY}&language=it-IT`);
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

// ---------- Recommendation helpers (Wrapped) ----------

export interface TmdbRecommendation {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

/**
 * Discover Korean dramas filtered by genres, in Italian. Used by Wrapped's
 * "Recommended for you" slide. Falls back to en-US overview when missing.
 */
export async function discoverKoreanDramas(genreIds: number[] = []): Promise<TmdbRecommendation[]> {
  if (!API_KEY) return [];
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      language: 'it-IT',
      sort_by: 'vote_average.desc',
      'vote_count.gte': '100',
      with_original_language: 'ko',
      page: '1',
    });
    if (genreIds.length) params.set('with_genres', genreIds.join('|'));
    const res = await fetch(`${BASE}/discover/tv?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 10);
  } catch {
    return [];
  }
}

// Reverse-map our app's genre tags into TMDB genre IDs for discover queries.
export const APP_GENRE_TO_TMDB: Record<string, number[]> = {
  Romance: [10766, 18],
  Historical: [37, 18],
  Thriller: [9648, 80, 10768],
  Comedy: [35, 10767],
  Melodrama: [18],
  Fantasy: [10765, 14],
  'Slice of Life': [10751, 18],
  Horror: [27, 9648],
};
