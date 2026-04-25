import { useNavigate, useParams } from "react-router-dom";
import { getDrama, updateDrama } from "@/lib/store";
import DramaForm from "@/components/DramaForm";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Drama } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function EditDrama() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drama, setDrama] = useState<Drama | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDrama = async () => {
      if (id) {
        try {
          const data = await getDrama(id);
          setDrama(data);
        } catch (error) {
          console.error(
            "Errore nel caricamento del drama per la modifica:",
            error,
          );
          toast.error("Could not load drama data");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadDrama();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center gap-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading drama info...</p>
        </div>
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center gap-4 py-20">
          <span className="text-4xl">😢</span>
          <p className="text-muted-foreground">Drama not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8">
        <h1 className="mb-6 text-center font-display text-2xl font-bold text-foreground">
          ✏️ Edit Drama
        </h1>
        <DramaForm
          initial={drama}
          onSubmit={async (data) => {
            try {
              await updateDrama(drama.id, data);
              toast.success("Changes saved! 💾");
              navigate(`/drama/${drama.id}`);
            } catch (error) {
              toast.error("Failed to save changes. Try again.");
            }
          }}
        />
      </main>
    </div>
  );
}
