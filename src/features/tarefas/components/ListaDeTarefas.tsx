"use client";

import Typography from "@mui/material/Typography";
import { textos } from "@/i18n/textos";
import { ordenarTarefas } from "../rules/ordenarTarefas";
import type { Tarefa } from "../types";
import { ItemDaTarefa } from "./ItemDaTarefa";

type Propriedades = {
  tarefas: readonly Tarefa[];
  mensagemDeListaVazia: string;
  aoAlternarConclusao: (tarefa: Tarefa) => void;
  aoEditar: (tarefa: Tarefa) => void;
  aoExcluir: (tarefa: Tarefa) => void;
};

export function ListaDeTarefas({ tarefas, mensagemDeListaVazia, ...acoes }: Propriedades) {
  if (tarefas.length === 0) {
    return <Typography color="text.secondary">{mensagemDeListaVazia}</Typography>;
  }
  return (
    <ul className="flex flex-col gap-2" aria-label={textos.tarefas.titulo}>
      {ordenarTarefas(tarefas).map((tarefa) => (
        <ItemDaTarefa key={tarefa.id} tarefa={tarefa} {...acoes} />
      ))}
    </ul>
  );
}
