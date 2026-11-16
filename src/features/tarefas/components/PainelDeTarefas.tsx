"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { DialogoDeConfirmacao } from "@/components/ui/DialogoDeConfirmacao";
import { IndicadorDeCarregamento } from "@/components/ui/IndicadorDeCarregamento";
import { textos } from "@/i18n/textos";
import { useTarefas } from "../hooks/useTarefas";
import { resumirTarefas } from "../rules/resumirTarefas";
import type { Tarefa } from "../types";
import { DialogoDeEdicao } from "./DialogoDeEdicao";
import { FormularioDeTarefa } from "./FormularioDeTarefa";
import { ListaDeTarefas } from "./ListaDeTarefas";

const TEXTOS = textos.tarefas;

export function PainelDeTarefas() {
  const { tarefas, estaCarregando, mensagemDeErro, adicionar, alterar, remover } = useTarefas();
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<Tarefa | null>(null);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<Tarefa | null>(null);
  const resumo = resumirTarefas(tarefas);

  async function confirmarExclusao() {
    if (tarefaParaExcluir) await remover(tarefaParaExcluir.id);
    setTarefaParaExcluir(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <Paper variant="outlined" className="flex flex-col gap-3 p-4">
        <Typography variant="h2">{TEXTOS.novaTarefa}</Typography>
        <FormularioDeTarefa rotuloDoBotao={TEXTOS.botaoAdicionar} aoSalvar={adicionar} limparAoSalvar />
      </Paper>
      {mensagemDeErro && <Alert severity="error">{mensagemDeErro}</Alert>}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="h2">{TEXTOS.titulo}</Typography>
          <Typography color="text.secondary">
            {TEXTOS.resumo(resumo.concluidas, resumo.total)}
          </Typography>
        </div>
        <LinearProgress variant="determinate" value={resumo.percentualConcluido} />
        {estaCarregando ? (
          <IndicadorDeCarregamento />
        ) : (
          <ListaDeTarefas
            tarefas={tarefas}
            aoAlternarConclusao={(tarefa) => alterar(tarefa.id, { concluida: !tarefa.concluida })}
            aoEditar={setTarefaEmEdicao}
            aoExcluir={setTarefaParaExcluir}
          />
        )}
      </section>
      <DialogoDeEdicao tarefa={tarefaEmEdicao} aoSalvar={alterar} aoFechar={() => setTarefaEmEdicao(null)} />
      <DialogoDeConfirmacao
        estaAberto={tarefaParaExcluir !== null}
        titulo={`${TEXTOS.confirmarExclusao} “${tarefaParaExcluir?.titulo ?? ""}”?`}
        detalhe={TEXTOS.confirmarExclusaoDetalhe}
        rotuloDaConfirmacao={textos.comum.excluir}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setTarefaParaExcluir(null)}
      />
    </div>
  );
}
