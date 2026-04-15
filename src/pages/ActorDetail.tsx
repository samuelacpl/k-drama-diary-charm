import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { getDramas } from '@/lib/store';
import { ActorInfo } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { profileUrl } from '@/lib/tmdb';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActorDetail() {
  const { actorId } = useParams<{ actorId: string }>();
  const navigate = useNavigate();
  const dramas = getDramas();

  const actor = useMemo(() => {
    const id = Number(actorId);
    let name = '';
    let profilePath = '';
    let lovedCount = 0;
    let hatedCount = 0;
    const linkedDramas: { id: string; title: string; coverImage: string; character: string }[] = [];

    dramas.forEach(d => {
      (d.cast ?? []).forEach((a: ActorInfo) => {
        if (a.id === id) {
          name = a.name;
          profilePath = a.profilePath;
          linkedDramas.push({ id: d.id, title: d.title, coverImage: d.coverImage, character: a.character });
          if (a.reaction === 'loved') lovedCount++;
          if (a.reaction === 'hated') hatedCount++;
        }
      });
    });

    if (!name) return null;
    return { id, name, profilePath, linkedDramas, lovedCount, hatedCount };
  }, [actorId, dramas]);

  if (!actor) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Actor not found 😢</p>
          <Link to="/actors" className="text-primary font-semibold mt-4 inline-block">Back to Actors</Link>
        </div>
      </div>
    );
  }

  const imgSrc = actor.profilePath?.startsWith('http') ? actor.profilePath : profileUrl(actor.profilePath);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-2xl py-8 space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex flex-col items-center text-center space-y-3 animate-fade-in">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border bg-muted">
            {imgSrc ? (
              <img src={imgSrc} alt={actor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">🎭</div>
            )}
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{actor.name}</h1>
          <div className="flex gap-3 text-sm">
            {actor.lovedCount > 0 && <span>❤️ Loved {actor.lovedCount}×</span>}
            {actor.hatedCount > 0 && <span>💀 Hated {actor.hatedCount}×</span>}
          </div>
          <p className="text-sm text-muted-foreground">{actor.linkedDramas.length} drama{actor.linkedDramas.length !== 1 ? 's' : ''} in your diary</p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">📺 Dramas</h2>
          {actor.linkedDramas.map(d => (
            <Link key={d.id} to={`/drama/${d.id}`}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-in">
              <img src={d.coverImage || '/placeholder.svg'} alt={d.title}
                className="w-12 h-16 object-cover rounded-lg border border-border shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{d.title}</h3>
                <p className="text-xs text-muted-foreground">as {d.character}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
