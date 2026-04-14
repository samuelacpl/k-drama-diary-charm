import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AddDrama from "./pages/AddDrama";
import DramaDetail from "./pages/DramaDetail";
import EditDrama from "./pages/EditDrama";
import Ranking from "./pages/Ranking";
import Gallery from "./pages/Gallery";
import Quotes from "./pages/Quotes";
import Stats from "./pages/Stats";
import Actors from "./pages/Actors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add" element={<AddDrama />} />
          <Route path="/drama/:id" element={<DramaDetail />} />
          <Route path="/drama/:id/edit" element={<EditDrama />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
