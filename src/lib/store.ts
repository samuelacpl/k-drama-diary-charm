import { Drama } from "./types";

const STORAGE_KEY = "kdrama-diary";

export function getDramas(): Drama[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDrama(drama: Drama): void {
  const dramas = getDramas();
  const idx = dramas.findIndex((d) => d.id === drama.id);
  if (idx >= 0) dramas[idx] = drama;
  else dramas.push(drama);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
}

export function deleteDrama(id: string): void {
  const dramas = getDramas().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
}

export function getDrama(id: string): Drama | undefined {
  return getDramas().find((d) => d.id === id);
}
