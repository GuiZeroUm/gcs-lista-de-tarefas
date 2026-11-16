import { describe, expect, test } from "vitest";
import { ordenarTarefas } from "@/features/tarefas/rules/ordenarTarefas";
import { criarTarefaDeExemplo } from "../../support/fabricas";

const titulos = (tarefas: { titulo: string }[]) => tarefas.map((tarefa) => tarefa.titulo);

describe("ordenação das tarefas", () => {
  test("pendentes vêm antes das concluídas", () => {
    const feita = criarTarefaDeExemplo({ titulo: "feita", concluida: true, prioridade: "alta" });
    const pendente = criarTarefaDeExemplo({ titulo: "pendente", prioridade: "baixa" });
    expect(titulos(ordenarTarefas([feita, pendente]))).toEqual(["pendente", "feita"]);
  });

  test("entre pendentes, a prioridade alta vem primeiro", () => {
    const baixa = criarTarefaDeExemplo({ titulo: "baixa", prioridade: "baixa" });
    const alta = criarTarefaDeExemplo({ titulo: "alta", prioridade: "alta" });
    const media = criarTarefaDeExemplo({ titulo: "media", prioridade: "media" });
    expect(titulos(ordenarTarefas([baixa, alta, media]))).toEqual(["alta", "media", "baixa"]);
  });

  test("com mesma situação e prioridade, a mais recente vem primeiro", () => {
    const antiga = criarTarefaDeExemplo({ titulo: "antiga", criadaEm: "2026-11-01T10:00:00Z" });
    const nova = criarTarefaDeExemplo({ titulo: "nova", criadaEm: "2026-11-10T10:00:00Z" });
    expect(titulos(ordenarTarefas([antiga, nova]))).toEqual(["nova", "antiga"]);
  });

  test("não altera a lista original", () => {
    const lista = [criarTarefaDeExemplo({ concluida: true }), criarTarefaDeExemplo()];
    const copia = [...lista];
    ordenarTarefas(lista);
    expect(lista).toEqual(copia);
  });
});
