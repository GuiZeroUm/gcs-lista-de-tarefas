import { act, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { ENDERECOS } from "@/components/layout/enderecos";
import { ProtecaoDeRota } from "@/features/auth/components/ProtecaoDeRota";
import { RedirecionarSeLogado } from "@/features/auth/components/RedirecionarSeLogado";
import { navegacaoFalsa } from "../support/navegacaoFalsa";
import { renderizarComTema } from "../support/renderizarComTema";
import { supabase } from "../support/usarSupabaseFalso";

const CONTEUDO_PROTEGIDO = "área só para quem está logado";

function renderizarAreaProtegida() {
  renderizarComTema(
    <ProtecaoDeRota>
      <p>{CONTEUDO_PROTEGIDO}</p>
    </ProtecaoDeRota>,
  );
}

beforeEach(() => {
  supabase.atual.cadastrarUsuario("ana@exemplo.com", "senha123");
});

describe("acesso à área protegida", () => {
  test("sem login, o conteúdo não aparece e a pessoa vai para o login", async () => {
    renderizarAreaProtegida();
    await act(() => Promise.resolve());
    expect(screen.queryByText(CONTEUDO_PROTEGIDO)).not.toBeInTheDocument();
    expect(navegacaoFalsa.replace).toHaveBeenCalledWith(ENDERECOS.entrar);
  });

  test("com login, o conteúdo aparece", async () => {
    supabase.atual.entrarComo("ana@exemplo.com");
    renderizarAreaProtegida();
    expect(await screen.findByText(CONTEUDO_PROTEGIDO)).toBeInTheDocument();
    expect(navegacaoFalsa.replace).not.toHaveBeenCalled();
  });

  test("ao sair, o conteúdo some e volta para o login", async () => {
    supabase.atual.entrarComo("ana@exemplo.com");
    renderizarAreaProtegida();
    await screen.findByText(CONTEUDO_PROTEGIDO);
    act(() => supabase.atual.mudarSessao("SIGNED_OUT", null));
    expect(screen.queryByText(CONTEUDO_PROTEGIDO)).not.toBeInTheDocument();
    expect(navegacaoFalsa.replace).toHaveBeenCalledWith(ENDERECOS.entrar);
  });
});

describe("tela de login para quem já entrou", () => {
  test("quem já está logado é levado para as tarefas", async () => {
    supabase.atual.entrarComo("ana@exemplo.com");
    renderizarComTema(<RedirecionarSeLogado>formulário</RedirecionarSeLogado>);
    await act(() => Promise.resolve());
    expect(navegacaoFalsa.replace).toHaveBeenCalledWith(ENDERECOS.tarefas);
    expect(screen.queryByText("formulário")).not.toBeInTheDocument();
  });

  test("quem não está logado vê o formulário", async () => {
    renderizarComTema(<RedirecionarSeLogado>formulário</RedirecionarSeLogado>);
    expect(await screen.findByText("formulário")).toBeInTheDocument();
  });
});
