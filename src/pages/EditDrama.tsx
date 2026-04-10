import { useNavigate, useParams } from 'react-router-dom';
import { getDrama, updateDrama } from '@/lib/store';
import DramaForm from '@/components/DramaForm';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';

export default function EditDrama() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const drama = id ? getDrama(id) : undefined;

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
        <h1 className="mb-6 text-center font-display text-2xl font-bold text-foreground">✏️ Edit Drama</h1>
        <DramaForm
          initial={drama}
          onSubmit={(data) => {
            updateDrama(drama.id, data);
            toast.success('Changes saved! 💾');
            navigate(`/drama/${drama.id}`);
          }}
        />
      </main>
    </div>
  );
}
