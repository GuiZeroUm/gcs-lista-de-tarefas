import { describe, expect, test } from "vitest";
import { estaAtrasada } from "@/features/tarefas/rules/estaAtrasada";
import { criarTarefaDeExemplo } from "../../support/fabricas";

const HOJE = "2026-11-16";

describe("tarefa atrasada", () => {
  test("pendente com prazo antes de hoje está atrasada", () => {
    expect(estaAtrasada(criarTarefaDeExemplo({ prazo: "2026-11-15" }), HOJE)).toBe(true);
  });

  test("prazo de hoje ainda não está atrasado", () => {
    expect(estaAtrasada(criarTarefaDeExemplo({ prazo: HOJE }), HOJE)).toBe(false);
  });

  test("prazo futuro não está atrasado", () => {
    expect(estaAtrasada(criarTarefaDeExemplo({ prazo: "2026-12-01" }), HOJE)).toBe(false);
  });

  test("tarefa concluída nunca está atrasada", () => {
    expect(estaAtrasada(criarTarefaDeExemplo({ prazo: "2026-01-01", concluida: true }), HOJE)).toBe(false);
  });

  test("tarefa sem prazo nunca está atrasada", () => {
    expect(estaAtrasada(criarTarefaDeExemplo({ prazo: null }), HOJE)).toBe(false);
  });
});
