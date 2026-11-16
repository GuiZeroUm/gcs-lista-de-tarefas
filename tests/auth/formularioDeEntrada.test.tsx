import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import { ENDERECOS } from "@/components/layout/enderecos";
import { BotaoSair } from "@/features/auth/components/BotaoSair";
import { FormularioDeEntrada } from "@/features/auth/components/FormularioDeEntrada";
import { textos } from "@/i18n/textos";
import { navegacaoFalsa } from "../support/navegacaoFalsa";
import { renderizarComTema } from "../support/renderizarComTema";
import { supabase } from "../support/usarSupabaseFalso";

const TEXTOS = textos.auth;

async function preencherEEnviar(email: string, senha: string, botao: string) {
  const pessoa = userEvent.setup();
  await pessoa.type(screen.getByLabelText(new RegExp(TEXTOS.email)), email);
  await pessoa.type(screen.getByLabelText(new RegExp(TEXTOS.senha)), senha);
  await pessoa.click(screen.getByRole("button", { name: botao }));
  return pessoa;
}

beforeEach(() => {
  supabase.atual.cadastrarUsuario("ana@exemplo.com", "senha123");
  renderizarComTema(<FormularioDeEntrada />);
});

describe("formulário de login", () => {
  test("login correto leva para a lista de tarefas", async () => {
    await preencherEEnviar("ana@exemplo.com", "senha123", TEXTOS.botaoEntrar);
    expect(navegacaoFalsa.replace).toHaveBeenCalledWith(ENDERECOS.tarefas);
  });

  test("senha errada mostra mensagem e não libera o acesso", async () => {
    await preencherEEnviar("ana@exemplo.com", "errada123", TEXTOS.botaoEntrar);
    expect(await screen.findByText(textos.comum.erros.CREDENCIAIS_INVALIDAS)).toBeInTheDocument();
    expect(navegacaoFalsa.replace).not.toHaveBeenCalled();
  });

  test("e-mail inválido é barrado antes de chamar o Supabase", async () => {
    await preencherEEnviar("ana", "senha123", TEXTOS.botaoEntrar);
    expect(screen.getByText(TEXTOS.validacao.emailInvalido)).toBeInTheDocument();
    expect(supabase.atual.sessao).toBeNull();
  });
});

describe("formulário de cadastro", () => {
  test("cadastro válido cria a conta e entra", async () => {
    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.tituloCadastro }));
    await preencherEEnviar("nova@exemplo.com", "segura123", TEXTOS.botaoCadastrar);
    expect(supabase.atual.usuarios.map((usuario) => usuario.email)).toContain("nova@exemplo.com");
    expect(navegacaoFalsa.replace).toHaveBeenCalledWith(ENDERECOS.tarefas);
  });

  test("senha fraca no cadastro mostra a regra", async () => {
    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.tituloCadastro }));
    await preencherEEnviar("nova@exemplo.com", "curta", TEXTOS.botaoCadastrar);
    expect(screen.getByText(TEXTOS.validacao.senhaCurta)).toBeInTheDocument();
  });

  test("sem sessão após o cadastro, pede confirmação por e-mail", async () => {
    supabase.atual.auth.signUp = async () => ({ data: { session: null }, error: null });
    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.tituloCadastro }));
    await preencherEEnviar("nova@exemplo.com", "segura123", TEXTOS.botaoCadastrar);
    expect(await screen.findByText(TEXTOS.confirmeSeuEmail)).toBeInTheDocument();
  });
});

describe("botão sair", () => {
  test("encerra a sessão e volta para o login", async () => {
    supabase.atual.entrarComo("ana@exemplo.com");
    renderizarComTema(<BotaoSair />);
    await userEvent.click(screen.getByRole("button", { name: TEXTOS.botaoSair }));
    expect(supabase.atual.sessao).toBeNull();
    expect(navegacaoFalsa.replace).toHaveBeenCalledWith(ENDERECOS.entrar);
  });
});
