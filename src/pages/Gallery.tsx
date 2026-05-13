import { useMemo, useState } from "react";
import { useDramas } from "@/hooks/useDramas";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ImageIcon, Loader2, X } from "lucide-react";

type GalleryImage = {
  id: string;
  dataUrl: string;
  comment: string;
  createdAt?: string;
  dramaId: string;
  dramaTitle: string;
};

export default function Gallery() {
  const { data: dramas = [], isLoading } = useDramas();
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  // 2. Estrazione immagini (si aggiorna quando i drama sono caricati)
  const allImages = useMemo<GalleryImage[]>(() => {
    const list = dramas.flatMap((d) =>
      (d.watchingImages ?? []).map((img) => ({
        ...img,
        comment: img.comment ?? "",
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
              <button
                key={img.id}
                onClick={() => setSelected(img)}
                className="block w-full text-left break-inside-avoid group"
              >
                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={img.dataUrl}
                      alt={img.comment || img.dramaTitle}
                      className="w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    {img.createdAt && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-cream/90 text-foreground text-[10px] font-semibold shadow-sm backdrop-blur-sm">
                        {formatDate(img.createdAt)}
                      </span>
                    )}
                  </div>
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
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/90 hover:bg-background shadow-md transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <img
                src={selected.dataUrl}
                alt={selected.comment || selected.dramaTitle}
                className="w-full max-h-[60vh] object-contain bg-muted"
              />
              <div className="p-5 space-y-2">
                <Link
                  to={`/drama/${selected.dramaId}`}
                  className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors"
                >
                  📺 {selected.dramaTitle}
                </Link>
                {selected.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selected.createdAt)}
                  </p>
                )}
                {selected.comment && (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pt-2 border-t border-border">
                    {selected.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
