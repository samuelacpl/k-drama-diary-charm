import { Drama } from "./types";
import { cloudSaveDrama, cloudDeleteDrama } from "./cloudStore";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kdrama-diary";

// Helper interno per salvare senza crashare
function safeSetItem(data: Drama[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn(
      "Storage pieno o bloccato, i dati sono aggiornati solo in RAM.",
    );
  }
}

export function getDramas(): Drama[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return []; // Se il disco è bloccato, l'app crederà sia vuoto e scaricherà dal cloud
  }
}

// Questa funzione ora non crasha mai
export function setDramasLocal(dramas: Drama[]): void {
  safeSetItem(dramas);
}

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export function saveDrama(drama: Drama): void {
  const dramas = getDramas();
  const idx = dramas.findIndex((d) => d.id === drama.id);

  if (idx >= 0) dramas[idx] = drama;
  else dramas.push(drama);

  // 1. Prova a salvare localmente (non crasha più)
  safeSetItem(dramas);

  // 2. Forza sempre il salvataggio Cloud
  getUserId().then((uid) => {
    if (uid) cloudSaveDrama(drama, uid);
  });
}

export function updateDrama(id: string, data: Partial<Drama>): void {
  const dramas = getDramas();
  const idx = dramas.findIndex((d) => d.id === id);
  if (idx >= 0) {
    dramas[idx] = { ...dramas[idx], ...data };
    safeSetItem(dramas);
    getUserId().then((uid) => {
      if (uid) cloudSaveDrama(dramas[idx], uid);
    });
  }
}

export function deleteDrama(id: string): void {
  const dramas = getDramas().filter((d) => d.id !== id);
  safeSetItem(dramas);
  cloudDeleteDrama(id);
}

export function getDrama(id: string): Drama | undefined {
  return getDramas().find((d) => d.id === id);
}
