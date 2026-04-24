import { Drama } from "./types";
import { cloudSaveDrama, cloudDeleteDrama, cloudGetDramas } from "./cloudStore";
import { supabase } from "@/integrations/supabase/client";

// Recupera l'ID utente corrente
async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

// ORA ASINCRONA: Prende i dati solo dal Cloud
export async function getDramas(): Promise<Drama[]> {
  try {
    const data = await cloudGetDramas();
    return data || [];
  } catch (error) {
    console.error("Errore recupero dal database:", error);
    return [];
  }
}

// Salva direttamente nel Cloud
export async function saveDrama(drama: Drama): Promise<void> {
  const uid = await getUserId();
  if (uid) {
    await cloudSaveDrama(drama, uid);
    // Lanciamo un evento per avvisare le altre parti dell'app che i dati sono cambiati
    window.dispatchEvent(new Event("storage_updated"));
  } else {
    console.error("Utente non loggato, impossibile salvare.");
  }
}

// Aggiorna direttamente nel Cloud
export async function updateDrama(
  id: string,
  data: Partial<Drama>,
): Promise<void> {
  const dramas = await getDramas();
  const drama = dramas.find((d) => d.id === id);
  const uid = await getUserId();

  if (drama && uid) {
    const updatedDrama = { ...drama, ...data };
    await cloudSaveDrama(updatedDrama, uid);
    window.dispatchEvent(new Event("storage_updated"));
  }
}

// Elimina direttamente dal Cloud
export async function deleteDrama(id: string): Promise<void> {
  await cloudDeleteDrama(id);
  window.dispatchEvent(new Event("storage_updated"));
}

export async function getDrama(id: string): Promise<Drama | undefined> {
  const dramas = await getDramas();
  return dramas.find((d) => d.id === id);
}
