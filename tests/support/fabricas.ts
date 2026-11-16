import type { Tarefa } from "@/features/tarefas/types";

let contador = 0;

export function criarTarefaDeExemplo(campos: Partial<Tarefa> = {}): Tarefa {
  contador += 1;
  return {
    id: `tarefa-${contador}`,
    titulo: `Tarefa ${contador}`,
    descricao: null,
    prioridade: "media",
    concluida: false,
    criadaEm: "2026-11-16T12:00:00Z",
    ...campos,
  };
}
