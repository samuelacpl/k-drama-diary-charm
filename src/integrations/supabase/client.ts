import { createClient } from "@supabase/supabase-js"; // <-- MANCAVA QUESTA
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Storage sicuro per Safari/iOS e per la preview in iframe (storage partizionato).
// Se localStorage non è disponibile o è pieno, si usa una mappa in memoria:
// così la sessione resta valida per tutta la durata della tab invece di sparire.
const memoryStore = new Map<string, string>();

const customStorage = {
  getItem: (key: string) => {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) return v;
    } catch {
      // ignora: si usa la memoria
    }
    return memoryStore.get(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    memoryStore.set(key, value);
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn("Auth storage: localStorage non disponibile, sessione in RAM.");
    }
  },
  removeItem: (key: string) => {
    memoryStore.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {
      // Silenzio
    }
  },
};


export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: customStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  },
);
