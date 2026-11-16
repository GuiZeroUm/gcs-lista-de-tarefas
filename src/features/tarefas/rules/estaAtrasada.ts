import type { Tarefa } from "../types";

export function estaAtrasada(tarefa: Tarefa, hoje: string): boolean {
  if (tarefa.concluida || tarefa.prazo === null) return false;
  return tarefa.prazo < hoje;
}
