import { Drama } from "./types";
import { cloudSaveDrama, cloudDeleteDrama } from "./cloudStore";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kdrama-diary";

export function getDramas(): Drama[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setDramasLocal(dramas: Drama[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
  // Fire-and-forget cloud sync
  getUserId().then(uid => { if (uid) cloudSaveDrama(drama, uid); });
}

export function updateDrama(id: string, data: Partial<Drama>): void {
  const dramas = getDramas();
  const idx = dramas.findIndex((d) => d.id === id);
  if (idx >= 0) {
    dramas[idx] = { ...dramas[idx], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
    getUserId().then(uid => { if (uid) cloudSaveDrama(dramas[idx], uid); });
  }
}

export function deleteDrama(id: string): void {
  const dramas = getDramas().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
  cloudDeleteDrama(id);
}

export function getDrama(id: string): Drama | undefined {
  return getDramas().find((d) => d.id === id);
}
