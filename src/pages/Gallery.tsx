import { useMemo } from "react";
import { useDramas } from "@/hooks/useDramas";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ImageIcon, Loader2 } from "lucide-react";

export default function Gallery() {
  const { data: dramas = [], isLoading } = useDramas();

  // 2. Estrazione immagini (si aggiorna quando i drama sono caricati)
  const allImages = useMemo(() => {
    const list = dramas.flatMap((d) =>
      (d.watchingImages ?? []).map((img) => ({
        ...img,
        dramaId: d.id,
        dramaTitle: d.title,
      })),
    );
    // Latest first when date available
    return list.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
  }, [dramas]);

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

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
                    decoding="async"
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
                    {img.createdAt && (
                      <p className="text-[10px] text-muted-foreground/70">
                        {formatDate(img.createdAt)}
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
