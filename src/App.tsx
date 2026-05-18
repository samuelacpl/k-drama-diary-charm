import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";

// Eager: la home è la prima vista dopo il login, conviene tenerla nel bundle iniziale
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy: tutto il resto viene caricato on-demand per ridurre il bundle iniziale (mobile-first)
const AddDrama = lazy(() => import("./pages/AddDrama"));
const DramaDetail = lazy(() => import("./pages/DramaDetail"));
const EditDrama = lazy(() => import("./pages/EditDrama"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Quotes = lazy(() => import("./pages/Quotes"));
const Stats = lazy(() => import("./pages/Stats"));
const Actors = lazy(() => import("./pages/Actors"));
const ActorDetail = lazy(() => import("./pages/ActorDetail"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Osts = lazy(() => import("./pages/Osts"));
const Wrapped = lazy(() => import("./pages/Wrapped"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground animate-pulse text-sm">Loading…</p>
    </div>
  );
}

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
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
                path="/osts"
                element={
                  <ProtectedRoute>
                    <Osts />
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
              <Route
                path="/wrapped"
                element={
                  <ProtectedRoute>
                    <Wrapped />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
