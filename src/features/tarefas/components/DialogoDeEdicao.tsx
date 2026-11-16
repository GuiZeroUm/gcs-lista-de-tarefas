"use client";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { textos } from "@/i18n/textos";
import type { DadosDaTarefa, Tarefa } from "../types";
import { FormularioDeTarefa } from "./FormularioDeTarefa";

type Propriedades = {
  tarefa: Tarefa | null;
  aoSalvar: (id: string, dados: DadosDaTarefa) => Promise<boolean>;
  aoFechar: () => void;
};

export function DialogoDeEdicao({ tarefa, aoSalvar, aoFechar }: Propriedades) {
  async function salvar(dados: DadosDaTarefa) {
    if (!tarefa) return false;
    const salvou = await aoSalvar(tarefa.id, dados);
    if (salvou) aoFechar();
    return salvou;
  }

  return (
    <Dialog open={tarefa !== null} onClose={aoFechar} fullWidth maxWidth="sm">
      <DialogTitle>{textos.tarefas.editarTarefa}</DialogTitle>
      <DialogContent className="pt-2">
        {tarefa && (
          <div className="pt-2">
            <FormularioDeTarefa
              valoresIniciais={tarefa}
              rotuloDoBotao={textos.comum.salvar}
              aoSalvar={salvar}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
