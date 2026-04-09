import { Drama } from './types';
import { toast } from 'sonner';

const STORAGE_KEY = 'kdrama-diary';

function loadDramas(): Drama[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveDramas(dramas: Drama[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dramas));
    return true;
  } catch {
    toast.error('Storage is full! Please free up space.');
    return false;
  }
}

export function getDramas(): Drama[] {
  return loadDramas();
}

export function getDrama(id: string): Drama | undefined {
  return loadDramas().find(d => d.id === id);
}

export function addDrama(drama: Omit<Drama, 'id' | 'createdAt' | 'updatedAt'>): Drama {
  const dramas = loadDramas();
  const newDrama: Drama = {
    ...drama,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dramas.push(newDrama);
  saveDramas(dramas);
  return newDrama;
}

export function updateDrama(id: string, updates: Partial<Drama>): Drama | undefined {
  const dramas = loadDramas();
  const index = dramas.findIndex(d => d.id === id);
  if (index === -1) return undefined;
  dramas[index] = { ...dramas[index], ...updates, updatedAt: new Date().toISOString() };
  saveDramas(dramas);
  return dramas[index];
}

export function deleteDrama(id: string): boolean {
  const dramas = loadDramas();
  const filtered = dramas.filter(d => d.id !== id);
  if (filtered.length === dramas.length) return false;
  saveDramas(filtered);
  return true;
}

export function toggleFavorite(id: string): Drama | undefined {
  const drama = getDrama(id);
  if (!drama) return undefined;
  return updateDrama(id, { isFavorite: !drama.isFavorite });
}
