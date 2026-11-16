import { beforeEach, describe, expect, test } from "vitest";
import { cadastrar, entrar, observarSessao, sair } from "@/features/auth/services/autenticacao";
import type { EstadoDaSessao } from "@/features/auth/types";
import { ErroDeNegocio } from "@/lib/erros";
import { supabase } from "../support/usarSupabaseFalso";

beforeEach(() => {
  supabase.atual.cadastrarUsuario("ana@exemplo.com", "senha123");
});

describe("serviço de autenticação", () => {
  test("entra com credenciais corretas", async () => {
    const sessao = await entrar({ email: "ana@exemplo.com", senha: "senha123" });
    expect(sessao).toMatchObject({ situacao: "autenticado", usuario: { email: "ana@exemplo.com" } });
  });

  test("senha errada vira CREDENCIAIS_INVALIDAS", async () => {
    await expect(entrar({ email: "ana@exemplo.com", senha: "errada99" })).rejects.toEqual(
      new ErroDeNegocio("CREDENCIAIS_INVALIDAS"),
    );
  });

  test("cadastro de e-mail repetido vira EMAIL_JA_CADASTRADO", async () => {
    await expect(cadastrar({ email: "ana@exemplo.com", senha: "outra123" })).rejects.toEqual(
      new ErroDeNegocio("EMAIL_JA_CADASTRADO"),
    );
  });

  test("erro desconhecido do Supabase vira FALHA_NA_AUTENTICACAO", async () => {
    supabase.atual.erroDeAutenticacao = { code: "over_request_rate_limit", message: "rate limit" };
    await expect(entrar({ email: "ana@exemplo.com", senha: "senha123" })).rejects.toEqual(
      new ErroDeNegocio("FALHA_NA_AUTENTICACAO"),
    );
  });

  test("observa a sessão do início ao logout", async () => {
    const estados: EstadoDaSessao["situacao"][] = [];
    const pararDeObservar = observarSessao((estado) => estados.push(estado.situacao));
    await Promise.resolve();
    await entrar({ email: "ana@exemplo.com", senha: "senha123" });
    await sair();
    pararDeObservar();
    expect(estados).toEqual(["anonimo", "autenticado", "anonimo"]);
  });
});
