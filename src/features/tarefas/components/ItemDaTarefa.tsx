"use client";

import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { textos } from "@/i18n/textos";
import type { Prioridade, Tarefa } from "../types";

const TEXTOS = textos.tarefas;

const COR_DA_PRIORIDADE: Record<Prioridade, "error" | "warning" | "default"> = {
  alta: "error",
  media: "warning",
  baixa: "default",
};

type Propriedades = {
  tarefa: Tarefa;
  aoAlternarConclusao: (tarefa: Tarefa) => void;
  aoEditar: (tarefa: Tarefa) => void;
  aoExcluir: (tarefa: Tarefa) => void;
};

export function ItemDaTarefa({ tarefa, aoAlternarConclusao, aoEditar, aoExcluir }: Propriedades) {
  const rotuloDaConclusao = tarefa.concluida
    ? TEXTOS.marcarComoPendente
    : TEXTOS.marcarComoConcluida;

  return (
    <Paper variant="outlined" component="li" className="flex items-start gap-2 p-3">
      <Checkbox
        checked={tarefa.concluida}
        onChange={() => aoAlternarConclusao(tarefa)}
        slotProps={{ input: { "aria-label": `${rotuloDaConclusao}: ${tarefa.titulo}` } }}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-2">
        <Typography
          className="break-words"
          sx={{ textDecoration: tarefa.concluida ? "line-through" : "none" }}
          color={tarefa.concluida ? "text.secondary" : "text.primary"}
        >
          {tarefa.titulo}
        </Typography>
        {tarefa.descricao && (
          <Typography variant="body2" color="text.secondary" className="break-words">
            {tarefa.descricao}
          </Typography>
        )}
        <div className="flex flex-wrap gap-2">
          <Chip
            size="small"
            label={TEXTOS.prioridades[tarefa.prioridade]}
            color={COR_DA_PRIORIDADE[tarefa.prioridade]}
          />
        </div>
      </div>
      <IconButton aria-label={`${TEXTOS.editar}: ${tarefa.titulo}`} onClick={() => aoEditar(tarefa)}>
        <EditOutlinedIcon />
      </IconButton>
      <IconButton
        aria-label={`${textos.comum.excluir}: ${tarefa.titulo}`}
        onClick={() => aoExcluir(tarefa)}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Paper>
  );
}
