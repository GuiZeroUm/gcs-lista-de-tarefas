import type { ResumoDasTarefas, Tarefa } from "../types";

export function resumirTarefas(tarefas: readonly Tarefa[]): ResumoDasTarefas {
  const total = tarefas.length;
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
  const percentualConcluido = total === 0 ? 0 : Math.round((concluidas / total) * 100);
  return { total, concluidas, pendentes: total - concluidas, percentualConcluido };
}
