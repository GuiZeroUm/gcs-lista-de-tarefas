export const PRIORIDADES = ["alta", "media", "baixa"] as const;

export type Prioridade = (typeof PRIORIDADES)[number];

export type Tarefa = {
  id: string;
  titulo: string;
  descricao: string | null;
  prioridade: Prioridade;
  concluida: boolean;
  prazo: string | null;
  criadaEm: string;
};

export type DadosDaTarefa = Pick<Tarefa, "titulo" | "descricao" | "prioridade" | "prazo">;

export type AlteracaoDaTarefa = Partial<DadosDaTarefa & Pick<Tarefa, "concluida">>;

export type ResumoDasTarefas = {
  total: number;
  concluidas: number;
  pendentes: number;
  percentualConcluido: number;
};
