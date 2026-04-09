import { useNavigate } from 'react-router-dom';
import { addDrama } from '@/lib/store';
import DramaForm from '@/components/DramaForm';
import { toast } from 'sonner';

export default function AddDrama() {
  const navigate = useNavigate();

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-center font-display text-2xl font-bold text-foreground">✨ Add New Drama</h1>
      <DramaForm
        onSubmit={(data) => {
          addDrama(data);
          toast.success('Drama saved to your diary! 🌸');
          navigate('/');
        }}
      />
    </div>
  );
}
