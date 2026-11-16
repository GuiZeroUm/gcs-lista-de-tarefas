import { describe, expect, test } from "vitest";
import { esquemaDeCadastro, esquemaDeEntrada } from "@/features/auth/schemas";
import { textos } from "@/i18n/textos";

const MENSAGENS = textos.auth.validacao;

function mensagemDoCadastro(email: string, senha: string) {
  const resultado = esquemaDeCadastro.safeParse({ email, senha });
  return resultado.success ? null : resultado.error.issues[0].message;
}

describe("validação de entrada", () => {
  test("normaliza o e-mail para minúsculas e sem espaços", () => {
    const dados = esquemaDeEntrada.parse({ email: "  Aluno@Exemplo.COM ", senha: "x" });
    expect(dados.email).toBe("aluno@exemplo.com");
  });

  test("recusa e-mail inválido", () => {
    const resultado = esquemaDeEntrada.safeParse({ email: "sem-arroba", senha: "x" });
    expect(resultado.success ? null : resultado.error.issues[0].message).toBe(MENSAGENS.emailInvalido);
  });

  test("exige a senha para entrar", () => {
    const resultado = esquemaDeEntrada.safeParse({ email: "a@b.com", senha: "" });
    expect(resultado.success ? null : resultado.error.issues[0].message).toBe(MENSAGENS.senhaObrigatoria);
  });
});

describe("validação de cadastro", () => {
  test("aceita senha com 8+ caracteres, letras e números", () => {
    expect(mensagemDoCadastro("a@b.com", "senha123")).toBeNull();
  });

  test("recusa senha curta", () => {
    expect(mensagemDoCadastro("a@b.com", "abc123")).toBe(MENSAGENS.senhaCurta);
  });

  test("recusa senha sem número", () => {
    expect(mensagemDoCadastro("a@b.com", "somenteletras")).toBe(MENSAGENS.senhaSemLetraOuNumero);
  });

  test("recusa senha sem letra", () => {
    expect(mensagemDoCadastro("a@b.com", "12345678")).toBe(MENSAGENS.senhaSemLetraOuNumero);
  });
});
