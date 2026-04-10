import { getDramas } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';

export default function Gallery() {
  const dramas = getDramas();
  const allImages = dramas.flatMap(d =>
    (d.watchingImages ?? []).map(img => ({
      ...img,
      dramaId: d.id,
      dramaTitle: d.title,
    }))
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">📸 Gallery</h1>
          <p className="text-sm text-muted-foreground">Your watching moments</p>
        </div>

        {allImages.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ImageIcon size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No photos yet! Add some in the "Watching It" section when editing a drama.</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {allImages.map(img => (
              <Link key={img.id} to={`/drama/${img.dramaId}`} className="block break-inside-avoid group">
                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <img src={img.dataUrl} alt={img.comment || img.dramaTitle} className="w-full object-cover" loading="lazy" />
                  <div className="p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{img.dramaTitle}</p>
                    {img.comment && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{img.comment}</p>
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
