import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

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
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=12`);
    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ error: `Deezer error: ${res.status} ${txt}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    const tracks = (data.data ?? []).map((t: any) => ({
      id: String(t.id),
      name: t.title,
      artist: t.artist?.name ?? '',
      cover: t.album?.cover_medium || t.album?.cover || '',
      preview: t.preview || '',
      url: t.link || '',
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