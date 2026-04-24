import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { cloudGetDramas } from "@/lib/cloudStore";
import Index from "./pages/Index";
import AddDrama from "./pages/AddDrama";
import DramaDetail from "./pages/DramaDetail";
import EditDrama from "./pages/EditDrama";
import Ranking from "./pages/Ranking";
import Gallery from "./pages/Gallery";
import Quotes from "./pages/Quotes";
import Stats from "./pages/Stats";
import Actors from "./pages/Actors";
import ActorDetail from "./pages/ActorDetail";
import Watchlist from "./pages/Watchlist";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground animate-pulse">Loading Auth...</p>
        </div>
      </div>
    );

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function CloudSync({ children }: { children: React.ReactNode }) {
  // Ora che usiamo il Cloud-Only, non serve più sincronizzare manualmente qui.
  // Le singole pagine caricano i dati all'avvio.
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CloudSync>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AddDrama />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drama/:id"
                element={
                  <ProtectedRoute>
                    <DramaDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/drama/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditDrama />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ranking"
                element={
                  <ProtectedRoute>
                    <Ranking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <Gallery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotes"
                element={
                  <ProtectedRoute>
                    <Quotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <Stats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/actors"
                element={
                  <ProtectedRoute>
                    <Actors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/actor/:actorId"
                element={
                  <ProtectedRoute>
                    <ActorDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CloudSync>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
