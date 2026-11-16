import { PRIORIDADES, type Tarefa } from "../types";

function compararTarefas(primeira: Tarefa, segunda: Tarefa): number {
  if (primeira.concluida !== segunda.concluida) return primeira.concluida ? 1 : -1;
  const diferencaDePrioridade =
    PRIORIDADES.indexOf(primeira.prioridade) - PRIORIDADES.indexOf(segunda.prioridade);
  if (diferencaDePrioridade !== 0) return diferencaDePrioridade;
  return segunda.criadaEm.localeCompare(primeira.criadaEm);
}

export function ordenarTarefas(tarefas: readonly Tarefa[]): Tarefa[] {
  return [...tarefas].sort(compararTarefas);
}
