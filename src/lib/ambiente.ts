import { z } from "zod";
import { falhar } from "./erros";

const esquemaDoAmbiente = z.object({
  urlDoSupabase: z.url(),
  chavePublicaDoSupabase: z.string().min(20),
});

export type Ambiente = z.infer<typeof esquemaDoAmbiente>;

export function lerAmbiente(variaveis: Record<string, string | undefined>): Ambiente {
  const resultado = esquemaDoAmbiente.safeParse({
    urlDoSupabase: variaveis.NEXT_PUBLIC_SUPABASE_URL,
    chavePublicaDoSupabase: variaveis.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!resultado.success) falhar("CONFIGURACAO_AUSENTE");
  return resultado.data;
}

export function obterAmbiente(): Ambiente {
  // O Next só embute NEXT_PUBLIC_* no bundle quando a variável é lida pelo nome literal.
  return lerAmbiente({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
