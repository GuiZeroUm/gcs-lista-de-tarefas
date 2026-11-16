import { describe, expect, test } from "vitest";
import { resumirTarefas } from "@/features/tarefas/rules/resumirTarefas";
import { criarTarefaDeExemplo } from "../../support/fabricas";

describe("resumo das tarefas", () => {
  test("lista vazia tem 0% concluído", () => {
    expect(resumirTarefas([])).toEqual({ total: 0, concluidas: 0, pendentes: 0, percentualConcluido: 0 });
  });

  test("conta concluídas, pendentes e arredonda o percentual", () => {
    const tarefas = [
      criarTarefaDeExemplo({ concluida: true }),
      criarTarefaDeExemplo(),
      criarTarefaDeExemplo(),
    ];
    expect(resumirTarefas(tarefas)).toEqual({
      total: 3,
      concluidas: 1,
      pendentes: 2,
      percentualConcluido: 33,
    });
  });

  test("todas concluídas dá 100%", () => {
    const tarefas = [criarTarefaDeExemplo({ concluida: true }), criarTarefaDeExemplo({ concluida: true })];
    expect(resumirTarefas(tarefas).percentualConcluido).toBe(100);
  });
});
