import type { FiltroDeSituacao, Tarefa } from "../types";

const CRITERIOS: Record<FiltroDeSituacao, (tarefa: Tarefa) => boolean> = {
  todas: () => true,
  pendentes: (tarefa) => !tarefa.concluida,
  concluidas: (tarefa) => tarefa.concluida,
};

export function filtrarTarefas(tarefas: readonly Tarefa[], filtro: FiltroDeSituacao): Tarefa[] {
  return tarefas.filter(CRITERIOS[filtro]);
}

export function contarPorSituacao(tarefas: readonly Tarefa[]): Record<FiltroDeSituacao, number> {
  return {
    todas: tarefas.length,
    pendentes: filtrarTarefas(tarefas, "pendentes").length,
    concluidas: filtrarTarefas(tarefas, "concluidas").length,
  };
}
