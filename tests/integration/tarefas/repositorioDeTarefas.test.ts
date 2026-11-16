import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  atualizarTarefa,
  criarTarefa,
  excluirTarefa,
  listarTarefas,
} from "@/features/tarefas/repositorioDeTarefas";
import { ErroDeNegocio } from "@/lib/erros";
import { supabase } from "../../support/usarSupabaseFalso";

const NOVA = { titulo: "Estudar Git", descricao: null, prioridade: "alta" as const };

beforeEach(() => {
  supabase.atual.cadastrarUsuario("ana@exemplo.com", "senha123");
  supabase.atual.cadastrarUsuario("bia@exemplo.com", "senha123");
  supabase.atual.entrarComo("ana@exemplo.com");
});

describe("CRUD de tarefas no Supabase", () => {
  test("cria e lista a tarefa criada", async () => {
    const criada = await criarTarefa(NOVA);
    expect(criada).toMatchObject({ titulo: "Estudar Git", prioridade: "alta", concluida: false });
    expect(await listarTarefas()).toEqual([criada]);
  });

  test("lista da mais recente para a mais antiga", async () => {
    await criarTarefa({ ...NOVA, titulo: "primeira" });
    await criarTarefa({ ...NOVA, titulo: "segunda" });
    const lista = await listarTarefas();
    expect(lista.map((tarefa) => tarefa.titulo)).toEqual(["segunda", "primeira"]);
  });

  test("edita título e conclusão", async () => {
    const criada = await criarTarefa(NOVA);
    const editada = await atualizarTarefa(criada.id, { titulo: "Estudar Git e GitHub", concluida: true });
    expect(editada).toMatchObject({ id: criada.id, titulo: "Estudar Git e GitHub", concluida: true, prioridade: "alta" });
  });

  test("exclui a tarefa", async () => {
    const criada = await criarTarefa(NOVA);
    await excluirTarefa(criada.id);
    expect(await listarTarefas()).toEqual([]);
  });

  test("excluir uma tarefa mantém as demais", async () => {
    const apagar = await criarTarefa({ ...NOVA, titulo: "apagar" });
    await criarTarefa({ ...NOVA, titulo: "manter" });
    await excluirTarefa(apagar.id);
    expect((await listarTarefas()).map((tarefa) => tarefa.titulo)).toEqual(["manter"]);
  });

  test("um usuário não enxerga nem edita tarefas de outro", async () => {
    const daAna = await criarTarefa(NOVA);
    supabase.atual.entrarComo("bia@exemplo.com");
    expect(await listarTarefas()).toEqual([]);
    await expect(atualizarTarefa(daAna.id, { concluida: true })).rejects.toEqual(
      new ErroDeNegocio("TAREFA_NAO_ENCONTRADA"),
    );
  });

  test("erro do banco vira ErroDeNegocio FALHA_NO_BANCO", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    supabase.atual.proximoErro = { code: "500", message: "conexão perdida" };
    await expect(listarTarefas()).rejects.toEqual(new ErroDeNegocio("FALHA_NO_BANCO"));
  });
});
