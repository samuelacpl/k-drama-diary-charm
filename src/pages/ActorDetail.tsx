import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react"; // Aggiunto useState e useEffect
import { getDramas } from "@/lib/store";
import { ActorInfo, Drama } from "@/lib/types"; // Aggiunto Drama type
import { Navbar } from "@/components/Navbar";
import { profileUrl } from "@/lib/tmdb";
import { ArrowLeft, Loader2 } from "lucide-react"; // Aggiunto Loader2 per il caricamento
import { Link } from "react-router-dom";

export default function ActorDetail() {
  const { actorId } = useParams<{ actorId: string }>();
  const navigate = useNavigate();

  // 1. Stato per i dati dei drama e stato di caricamento
  const [allDramas, setAllDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. useEffect per il caricamento asincrono (Cloud-first)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getDramas();
        setAllDramas(data);
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 3. Il calcolo dell'attore ora dipende da allDramas (lo stato) e non dalla funzione diretta
  const actor = useMemo(() => {
    if (isLoading || allDramas.length === 0) return null;

    const id = Number(actorId);
    let name = "";
    let profilePath = "";
    let lovedCount = 0;
    let hatedCount = 0;
    const linkedDramas: {
      id: string;
      title: string;
      coverImage: string;
      character: string;
    }[] = [];

    allDramas.forEach((d) => {
      (d.cast ?? []).forEach((a: ActorInfo) => {
        if (a.id === id) {
          name = a.name;
          profilePath = a.profilePath;
          linkedDramas.push({
            id: d.id,
            title: d.title,
            coverImage: d.coverImage,
            character: a.character,
          });
          if (a.reaction === "loved") lovedCount++;
          if (a.reaction === "hated") hatedCount++;
        }
      });
    });

    if (!name) return null;
    return { id, name, profilePath, linkedDramas, lovedCount, hatedCount };
  }, [actorId, allDramas, isLoading]);

  // 4. Stato di caricamento UI
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4" size={32} />
          <p className="text-muted-foreground">Recupero dati dal cloud...</p>
        </div>
      </div>
    );
  }

  // Se i dati sono caricati ma l'attore non esiste
  if (!actor) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">Actor not found 😢</p>
          <Link
            to="/actors"
            className="text-primary font-semibold mt-4 inline-block"
          >
            Back to Actors
          </Link>
        </div>
      </div>
    );
  }

  const imgSrc = actor.profilePath?.startsWith("http")
    ? actor.profilePath
    : profileUrl(actor.profilePath);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-2xl py-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex flex-col items-center text-center space-y-3 animate-fade-in">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border bg-muted">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={actor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                🎭
              </div>
            )}
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {actor.name}
          </h1>
          <div className="flex gap-3 text-sm">
            {actor.lovedCount > 0 && <span>❤️ Loved {actor.lovedCount}×</span>}
            {actor.hatedCount > 0 && <span>💀 Hated {actor.hatedCount}×</span>}
          </div>
          <p className="text-sm text-muted-foreground">
            {actor.linkedDramas.length} drama
            {actor.linkedDramas.length !== 1 ? "s" : ""} in your diary
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">📺 Dramas</h2>
          {actor.linkedDramas.map((d) => (
            <Link
              key={d.id}
              to={`/drama/${d.id}`}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-in"
            >
              <img
                src={d.coverImage || "/placeholder.svg"}
                alt={d.title}
                className="w-12 h-16 object-cover rounded-lg border border-border shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{d.title}</h3>
                <p className="text-xs text-muted-foreground">
                  as {d.character}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
