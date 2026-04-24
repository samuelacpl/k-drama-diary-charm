import { useState, useEffect, useMemo } from "react"; // Aggiunti hooks
import { getDramas } from "@/lib/store";
import { Drama } from "@/lib/types"; // Importato tipo Drama
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ImageIcon, Loader2 } from "lucide-react"; // Aggiunto Loader2

export default function Gallery() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Caricamento dati asincrono
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getDramas();
        setDramas(data);
      } catch (error) {
        console.error("Errore caricamento gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Estrazione immagini (si aggiorna quando i drama sono caricati)
  const allImages = useMemo(() => {
    return dramas.flatMap((d) =>
      (d.watchingImages ?? []).map((img) => ({
        ...img,
        dramaId: d.id,
        dramaTitle: d.title,
      })),
    );
  }, [dramas]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">
            📸 Gallery
          </h1>
          <p className="text-sm text-muted-foreground">Your watching moments</p>
        </div>

        {/* 3. Gestione stato caricamento */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-2" size={32} />
            <p className="text-xs text-muted-foreground">
              Loading your memories...
            </p>
          </div>
        ) : allImages.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ImageIcon size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No photos yet! Add some in the "Watching It" section when editing
              a drama.
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {allImages.map((img) => (
              <Link
                key={img.id}
                to={`/drama/${img.dramaId}`}
                className="block break-inside-avoid group"
              >
                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={img.dataUrl}
                    alt={img.comment || img.dramaTitle}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">
                      {img.dramaTitle}
                    </p>
                    {img.comment && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {img.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
