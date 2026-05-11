import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDramas } from "@/lib/store";
import { Drama } from "@/lib/types";

export const DRAMAS_KEY = ["dramas"] as const;

/**
 * Single source of truth per i drama.
 * - Fetch UNA volta per sessione (staleTime alto)
 * - Condiviso tra tutte le pagine via React Query cache
 * - Si invalida automaticamente quando il store emette "storage_updated"
 */
export function useDramas() {
  const qc = useQueryClient();

  useEffect(() => {
    const onUpdate = () => qc.invalidateQueries({ queryKey: DRAMAS_KEY });
    window.addEventListener("storage_updated", onUpdate);
    return () => window.removeEventListener("storage_updated", onUpdate);
  }, [qc]);

  return useQuery<Drama[]>({
    queryKey: DRAMAS_KEY,
    queryFn: getDramas,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
