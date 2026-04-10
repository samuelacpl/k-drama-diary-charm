import { useNavigate } from "react-router-dom";
import { Drama } from "@/lib/types";
import { saveDrama } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import DramaForm from "@/components/DramaForm";

export default function AddDrama() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-8">
        <h1 className="font-display text-3xl font-semibold mb-8 text-center">Add New Drama ✨</h1>
        <DramaForm
          onSubmit={(data) => {
            const drama: Drama = {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            };
            saveDrama(drama);
            navigate(`/drama/${drama.id}`);
          }}
        />
      </main>
    </div>
  );
}
