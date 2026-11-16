import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { PainelDeTarefas } from "@/features/tarefas/components/PainelDeTarefas";
import { textos } from "@/i18n/textos";
import { renderizarComTema } from "../../support/renderizarComTema";
import { supabase } from "../../support/usarSupabaseFalso";

const TEXTOS = textos.tarefas;

async function abrirPainel() {
  renderizarComTema(<PainelDeTarefas />);
  await waitFor(() => expect(screen.queryByLabelText(textos.comum.carregando)).not.toBeInTheDocument());
}

async function criarPelaTela(titulo: string) {
  const formulario = screen.getByRole("button", { name: TEXTOS.botaoAdicionar }).closest("form")!;
  await userEvent.type(within(formulario).getByLabelText(new RegExp(TEXTOS.campoTitulo)), titulo);
  await userEvent.click(within(formulario).getByRole("button", { name: TEXTOS.botaoAdicionar }));
  await screen.findByText(titulo, { selector: "p" });
}

function lista() {
  return screen.getByRole("list", { name: TEXTOS.titulo });
}

beforeEach(() => {
  supabase.atual.cadastrarUsuario("ana@exemplo.com", "senha123");
  supabase.atual.entrarComo("ana@exemplo.com");
});

describe("tela de tarefas (CRUD de ponta a ponta com Supabase simulado)", () => {
  test("lista vazia mostra convite para criar a primeira tarefa", async () => {
    await abrirPainel();
    expect(screen.getByText(TEXTOS.listaVaziaNoFiltro.todas)).toBeInTheDocument();
    expect(screen.getByText(TEXTOS.resumo(0, 0))).toBeInTheDocument();
  });

  test("cria uma tarefa, salva no banco e limpa o formulário", async () => {
    await abrirPainel();
    await criarPelaTela("Entregar PGC");
    expect(supabase.atual.linhas).toHaveLength(1);
    expect(supabase.atual.linhas[0]).toMatchObject({ titulo: "Entregar PGC", prioridade: "media" });
    expect(screen.getByLabelText(new RegExp(TEXTOS.campoTitulo))).toHaveValue("");
  });

  test("cria tarefa com prioridade alta escolhida na lista", async () => {
    await abrirPainel();
    const formulario = screen.getByRole("button", { name: TEXTOS.botaoAdicionar }).closest("form")!;
    await userEvent.type(within(formulario).getByLabelText(new RegExp(TEXTOS.campoTitulo)), "Urgente");
    await userEvent.click(within(formulario).getByRole("combobox", { name: TEXTOS.campoPrioridade }));
    await userEvent.click(screen.getByRole("option", { name: TEXTOS.prioridades.alta }));
    await userEvent.click(within(formulario).getByRole("button", { name: TEXTOS.botaoAdicionar }));
    await screen.findByText("Urgente", { selector: "p" });
    expect(supabase.atual.linhas[0].prioridade).toBe("alta");
  });

  test("cria tarefa com prazo e mostra a data formatada", async () => {
    await abrirPainel();
    const formulario = screen.getByRole("button", { name: TEXTOS.botaoAdicionar }).closest("form")!;
    await userEvent.type(within(formulario).getByLabelText(new RegExp(TEXTOS.campoTitulo)), "Com prazo");
    await userEvent.type(within(formulario).getByLabelText(TEXTOS.campoPrazo), "2030-05-20");
    await userEvent.click(within(formulario).getByRole("button", { name: TEXTOS.botaoAdicionar }));
    await screen.findByText("Com prazo", { selector: "p" });
    expect(supabase.atual.linhas[0].prazo).toBe("2030-05-20");
    expect(within(lista()).getByText(TEXTOS.prazo("20/05/2030"))).toBeInTheDocument();
    expect(within(lista()).queryByText(TEXTOS.atrasada)).not.toBeInTheDocument();
  });

  test("destaca tarefa pendente com prazo vencido", async () => {
    supabase.atual.executarOperacao("insert", { titulo: "Vencida", prazo: "2020-01-10" }, null);
    await abrirPainel();
    expect(within(lista()).getByText(TEXTOS.atrasada)).toBeInTheDocument();
  });

  test("filtra por situação sem consultar o banco de novo", async () => {
    supabase.atual.executarOperacao("insert", { titulo: "A fazer" }, null);
    supabase.atual.executarOperacao("insert", { titulo: "Feita", concluida: true }, null);
    await abrirPainel();
    const consultasAoAbrir = supabase.atual.quantidadeDeConsultas;

    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.rotuloDoFiltro(TEXTOS.filtros.pendentes, 1) }));
    expect(within(lista()).getByText("A fazer")).toBeInTheDocument();
    expect(within(lista()).queryByText("Feita")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.rotuloDoFiltro(TEXTOS.filtros.concluidas, 1) }));
    expect(within(lista()).getByText("Feita")).toBeInTheDocument();
    expect(within(lista()).queryByText("A fazer")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.rotuloDoFiltro(TEXTOS.filtros.todas, 2) }));
    expect(within(lista()).getAllByRole("listitem")).toHaveLength(2);
    expect(supabase.atual.quantidadeDeConsultas).toBe(consultasAoAbrir);
  });

  test("filtro sem resultados mostra mensagem própria", async () => {
    supabase.atual.executarOperacao("insert", { titulo: "Só pendente" }, null);
    await abrirPainel();
    await userEvent.click(screen.getByRole("tab", { name: TEXTOS.rotuloDoFiltro(TEXTOS.filtros.concluidas, 0) }));
    expect(screen.getByText(TEXTOS.listaVaziaNoFiltro.concluidas)).toBeInTheDocument();
  });

  test("título vazio não é enviado ao banco", async () => {
    await abrirPainel();
    await userEvent.click(screen.getByRole("button", { name: TEXTOS.botaoAdicionar }));
    expect(screen.getByText(TEXTOS.validacao.tituloObrigatorio)).toBeInTheDocument();
    expect(supabase.atual.linhas).toHaveLength(0);
  });

  test("lista as tarefas já salvas ao abrir", async () => {
    supabase.atual.executarOperacao("insert", { titulo: "Já existia", prioridade: "alta" }, null);
    await abrirPainel();
    expect(within(lista()).getByText("Já existia")).toBeInTheDocument();
  });

  test("marca como concluída e atualiza o resumo", async () => {
    await abrirPainel();
    await criarPelaTela("Gravar vídeo");
    await userEvent.click(screen.getByRole("checkbox", { name: new RegExp(TEXTOS.marcarComoConcluida) }));
    await screen.findByText(TEXTOS.resumo(1, 1));
    expect(supabase.atual.linhas[0].concluida).toBe(true);
  });

  test("edita a tarefa pelo diálogo", async () => {
    await abrirPainel();
    await criarPelaTela("Rascunho");
    await userEvent.click(screen.getByRole("button", { name: `${TEXTOS.editar}: Rascunho` }));
    const dialogo = await screen.findByRole("dialog");
    const campoTitulo = within(dialogo).getByLabelText(new RegExp(TEXTOS.campoTitulo));
    await userEvent.clear(campoTitulo);
    await userEvent.type(campoTitulo, "Versão final");
    await userEvent.click(within(dialogo).getByRole("button", { name: textos.comum.salvar }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(within(lista()).getByText("Versão final")).toBeInTheDocument();
    expect(supabase.atual.linhas[0].titulo).toBe("Versão final");
  });

  test("exclui a tarefa após confirmar", async () => {
    await abrirPainel();
    await criarPelaTela("Apagar depois");
    await userEvent.click(screen.getByRole("button", { name: `${textos.comum.excluir}: Apagar depois` }));
    const dialogo = await screen.findByRole("dialog");
    await userEvent.click(within(dialogo).getByRole("button", { name: textos.comum.excluir }));
    await screen.findByText(TEXTOS.listaVaziaNoFiltro.todas);
    expect(supabase.atual.linhas).toHaveLength(0);
  });

  test("cancelar a exclusão mantém a tarefa", async () => {
    await abrirPainel();
    await criarPelaTela("Fica");
    await userEvent.click(screen.getByRole("button", { name: `${textos.comum.excluir}: Fica` }));
    await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: textos.comum.cancelar }));
    expect(supabase.atual.linhas).toHaveLength(1);
  });

  test("falha do banco mostra mensagem amigável", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    supabase.atual.proximoErro = { code: "500", message: "fora do ar" };
    await abrirPainel();
    expect(screen.getByText(textos.comum.erros.FALHA_NO_BANCO)).toBeInTheDocument();
  });
});
