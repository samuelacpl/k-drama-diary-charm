import { supabase } from '@/integrations/supabase/client';
import { Drama } from './types';

// Convert local Drama to DB row format
function toDbRow(drama: Drama, userId: string) {
  return {
    id: drama.id,
    user_id: userId,
    title: drama.title,
    platform: drama.platform,
    total_episodes: drama.totalEpisodes,
    episodes_watched: drama.episodesWatched,
    status: drama.status,
    cover_image: drama.coverImage,
    actors: drama.actors,
    favorite_quote: drama.favoriteQuote,
    favorite_quotes: drama.favoriteQuotes as any,
    plot: drama.plot,
    what_i_liked: drama.whatILiked,
    review: drama.review,
    rating: drama.rating,
    tags: drama.tags as any,
    emotional_tags: drama.emotionalTags as any,
    favorite_characters: drama.favoriteCharacters,
    favorite_songs: drama.favoriteSongs,
    second_lead_syndrome: drama.secondLeadSyndrome,
    is_favorite: drama.isFavorite,
    watching_images: drama.watchingImages as any,
    watched_with_glassimo: drama.watchedWithGlassimo,
    glassimo_review: drama.glassimoReview,
    tmdb_id: drama.tmdbId ?? null,
    cast_data: drama.cast as any,
    created_at: drama.createdAt,
  };
}

// Convert DB row to local Drama format
function fromDbRow(row: any): Drama {
  return {
    id: row.id,
    title: row.title,
    platform: row.platform || '',
    totalEpisodes: row.total_episodes || 16,
    episodesWatched: row.episodes_watched || 0,
    status: row.status,
    coverImage: row.cover_image || '',
    actors: row.actors || '',
    favoriteQuote: row.favorite_quote || '',
    favoriteQuotes: (row.favorite_quotes as string[]) || [],
    plot: row.plot || '',
    whatILiked: row.what_i_liked || '',
    review: row.review || '',
    rating: row.rating || 0,
    tags: (row.tags as string[]) || [],
    emotionalTags: (row.emotional_tags as string[]) || [],
    favoriteCharacters: row.favorite_characters || '',
    favoriteSongs: row.favorite_songs || '',
    secondLeadSyndrome: row.second_lead_syndrome || false,
    isFavorite: row.is_favorite || false,
    createdAt: row.created_at,
    watchingImages: (row.watching_images as any[]) || [],
    watchedWithGlassimo: row.watched_with_glassimo || false,
    glassimoReview: row.glassimo_review || '',
    tmdbId: row.tmdb_id ?? undefined,
    cast: (row.cast_data as any[]) || [],
  };
}

export async function cloudGetDramas(): Promise<Drama[]> {
  const { data, error } = await supabase.from('dramas').select('*').order('created_at', { ascending: false });
  if (error) { console.error('cloudGetDramas error:', error); return []; }
  return (data || []).map(fromDbRow);
}

export async function cloudSaveDrama(drama: Drama, userId: string): Promise<void> {
  const row = toDbRow(drama, userId);
  const { error } = await supabase.from('dramas').upsert(row, { onConflict: 'id' });
  if (error) console.error('cloudSaveDrama error:', error);
}

export async function cloudDeleteDrama(id: string): Promise<void> {
  const { error } = await supabase.from('dramas').delete().eq('id', id);
  if (error) console.error('cloudDeleteDrama error:', error);
}
