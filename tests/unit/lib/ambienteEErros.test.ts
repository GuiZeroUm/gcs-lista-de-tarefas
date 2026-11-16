import { describe, expect, test } from "vitest";
import { lerAmbiente } from "@/lib/ambiente";
import { ErroDeNegocio, falhar, traduzirErro } from "@/lib/erros";
import { textos } from "@/i18n/textos";

describe("leitura do ambiente", () => {
  test("aceita URL e chave pública válidas", () => {
    const ambiente = lerAmbiente({
      NEXT_PUBLIC_SUPABASE_URL: "https://projeto.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_chave_de_teste_123",
    });
    expect(ambiente.urlDoSupabase).toBe("https://projeto.supabase.co");
  });

  test("falha com código conhecido quando as variáveis estão ausentes", () => {
    expect(() => lerAmbiente({})).toThrowError(new ErroDeNegocio("CONFIGURACAO_AUSENTE"));
  });
});

describe("erros de negócio", () => {
  test("falhar lança ErroDeNegocio com o código", () => {
    expect(() => falhar("TAREFA_NAO_ENCONTRADA")).toThrow(ErroDeNegocio);
  });

  test("traduz o código para a mensagem da interface", () => {
    expect(traduzirErro(new ErroDeNegocio("CREDENCIAIS_INVALIDAS"))).toBe(
      textos.comum.erros.CREDENCIAIS_INVALIDAS,
    );
  });

  test("erro desconhecido vira mensagem genérica, sem vazar detalhes", () => {
    expect(traduzirErro(new Error("stack interna"))).toBe(textos.comum.erros.FALHA_NO_BANCO);
  });
});
