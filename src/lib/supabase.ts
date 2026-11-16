import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { obterAmbiente } from "./ambiente";

let clienteSupabase: SupabaseClient | null = null;

export function obterClienteSupabase(): SupabaseClient {
  if (clienteSupabase) return clienteSupabase;
  const { urlDoSupabase, chavePublicaDoSupabase } = obterAmbiente();
  clienteSupabase = createClient(urlDoSupabase, chavePublicaDoSupabase);
  return clienteSupabase;
}
