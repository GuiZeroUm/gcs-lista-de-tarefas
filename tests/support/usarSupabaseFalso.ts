import { SupabaseFalso } from "./supabaseFalso";

export const supabase = { atual: new SupabaseFalso() };

export function reiniciarSupabaseFalso() {
  supabase.atual = new SupabaseFalso();
}
