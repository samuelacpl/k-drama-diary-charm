import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Index from '@/pages/Index';
import AddDrama from '@/pages/AddDrama';
import EditDrama from '@/pages/EditDrama';
import DramaDetail from '@/pages/DramaDetail';
import Ranking from '@/pages/Ranking';
import Stats from '@/pages/Stats';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add" element={<AddDrama />} />
          <Route path="/edit/:id" element={<EditDrama />} />
          <Route path="/drama/:id" element={<DramaDetail />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
