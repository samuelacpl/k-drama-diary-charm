import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

let cachedToken: { token: string; exp: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.exp - 30_000) return cachedToken.token;
  const id = Deno.env.get('SPOTIFY_CLIENT_ID');
  const secret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
  if (!id || !secret) throw new Error('Spotify credentials not configured');
  const auth = btoa(`${id}:${secret}`);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Spotify token failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, exp: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.trim() ?? '';
    if (!q) {
      return new Response(JSON.stringify({ tracks: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = await getSpotifyToken();
    const sr = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!sr.ok) {
      const txt = await sr.text();
      return new Response(JSON.stringify({ error: `Spotify search failed: ${sr.status} ${txt}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await sr.json();
    const tracks = (data.tracks?.items ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      artist: (t.artists ?? []).map((a: any) => a.name).join(', '),
      cover: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '',
      url: t.external_urls?.spotify || '',
    }));
    return new Response(JSON.stringify({ tracks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});