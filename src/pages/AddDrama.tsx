import { useNavigate } from "react-router-dom";
import { Drama } from "@/lib/types";
import { saveDrama, getDramas } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import DramaForm from "@/components/DramaForm";
import { toast } from "sonner";

export default function AddDrama() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8">
        <h1 className="font-display text-3xl font-semibold mb-8 text-center">Add New Drama ✨</h1>
        <DramaForm
          onSubmit={async (data) => {
            const existing = await getDramas();
            const dup = existing.find(
              (d) =>
                (data.tmdbId && d.tmdbId === data.tmdbId) ||
                d.title.trim().toLowerCase() === data.title.trim().toLowerCase(),
            );
            if (dup) {
              toast.error("Hai già aggiunto questo drama");
              return;
            }
            const drama: Drama = {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            };
            await saveDrama(drama);
            navigate(`/drama/${drama.id}`);
          }}
        />
      </main>
    </div>
  );
}
