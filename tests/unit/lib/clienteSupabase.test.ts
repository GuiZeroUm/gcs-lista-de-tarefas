import { afterEach, describe, expect, test, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function carregarModuloReal() {
  return vi.importActual<typeof import("@/lib/supabase")>("@/lib/supabase");
}

describe("cliente do Supabase", () => {
  test("cria um único cliente com as variáveis de ambiente", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://projeto-de-teste.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_chave_de_teste_123");
    const { obterClienteSupabase } = await carregarModuloReal();
    const cliente = obterClienteSupabase();
    expect(typeof cliente.from).toBe("function");
    expect(obterClienteSupabase()).toBe(cliente);
  });

  test("sem variáveis de ambiente, falha com CONFIGURACAO_AUSENTE", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const { obterClienteSupabase } = await carregarModuloReal();
    expect(() => obterClienteSupabase()).toThrow("CONFIGURACAO_AUSENTE");
  });
});
