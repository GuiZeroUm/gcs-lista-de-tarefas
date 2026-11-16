"use client";

import { useCallback, useEffect, useState } from "react";
import { traduzirErro } from "@/lib/erros";
import {
  atualizarTarefa,
  criarTarefa,
  excluirTarefa,
  listarTarefas,
} from "../repositorioDeTarefas";
import type { AlteracaoDaTarefa, DadosDaTarefa, Tarefa } from "../types";

export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [mensagemDeErro, setMensagemDeErro] = useState<string | null>(null);

  const executar = useCallback(async (operacao: () => Promise<void>) => {
    setMensagemDeErro(null);
    try {
      await operacao();
      return true;
    } catch (erro) {
      setMensagemDeErro(traduzirErro(erro));
      return false;
    }
  }, []);

  useEffect(() => {
    let estaMontado = true;
    listarTarefas()
      .then((lista) => estaMontado && setTarefas(lista))
      .catch((erro) => estaMontado && setMensagemDeErro(traduzirErro(erro)))
      .finally(() => estaMontado && setEstaCarregando(false));
    return () => {
      estaMontado = false;
    };
  }, []);

  const adicionar = (dados: DadosDaTarefa) =>
    executar(async () => {
      const criada = await criarTarefa(dados);
      setTarefas((atuais) => [criada, ...atuais]);
    });

  const alterar = (id: string, alteracao: AlteracaoDaTarefa) =>
    executar(async () => {
      const atualizada = await atualizarTarefa(id, alteracao);
      setTarefas((atuais) => atuais.map((tarefa) => (tarefa.id === id ? atualizada : tarefa)));
    });

  const remover = (id: string) =>
    executar(async () => {
      await excluirTarefa(id);
      setTarefas((atuais) => atuais.filter((tarefa) => tarefa.id !== id));
    });

  return { tarefas, estaCarregando, mensagemDeErro, adicionar, alterar, remover };
}
