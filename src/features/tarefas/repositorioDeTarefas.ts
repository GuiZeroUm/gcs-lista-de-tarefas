import { z } from "zod";
import { LIMITE_DE_TAREFAS_LISTADAS } from "@/lib/constantes";
import { ErroDeNegocio } from "@/lib/erros";
import { obterClienteSupabase } from "@/lib/supabase";
import { esquemaDaLinhaDoBanco } from "./schemas";
import type { AlteracaoDaTarefa, DadosDaTarefa, Tarefa } from "./types";

const TABELA = "tarefas";

type RespostaDoBanco = { data: unknown; error: { code?: string; message: string } | null };

function lerResposta<T>(resposta: RespostaDoBanco, esquema: z.ZodType<T>): T {
  if (resposta.error?.code === "PGRST116") throw new ErroDeNegocio("TAREFA_NAO_ENCONTRADA");
  if (resposta.error) {
    console.error("Erro do Supabase na tabela de tarefas", resposta.error.message);
    throw new ErroDeNegocio("FALHA_NO_BANCO");
  }
  return esquema.parse(resposta.data);
}

function converterAlteracao(alteracao: AlteracaoDaTarefa) {
  return {
    titulo: alteracao.titulo,
    descricao: alteracao.descricao,
    prioridade: alteracao.prioridade,
    concluida: alteracao.concluida,
  };
}

export async function listarTarefas(): Promise<Tarefa[]> {
  const resposta = await obterClienteSupabase()
    .from(TABELA)
    .select("*")
    .order("criada_em", { ascending: false })
    .limit(LIMITE_DE_TAREFAS_LISTADAS);
  return lerResposta(resposta, z.array(esquemaDaLinhaDoBanco));
}

export async function criarTarefa(dados: DadosDaTarefa): Promise<Tarefa> {
  const resposta = await obterClienteSupabase()
    .from(TABELA)
    .insert(converterAlteracao(dados))
    .select()
    .single();
  return lerResposta(resposta, esquemaDaLinhaDoBanco);
}

export async function atualizarTarefa(id: string, alteracao: AlteracaoDaTarefa): Promise<Tarefa> {
  const resposta = await obterClienteSupabase()
    .from(TABELA)
    .update(converterAlteracao(alteracao))
    .eq("id", id)
    .select()
    .single();
  return lerResposta(resposta, esquemaDaLinhaDoBanco);
}

export async function excluirTarefa(id: string): Promise<void> {
  const resposta = await obterClienteSupabase().from(TABELA).delete().eq("id", id);
  lerResposta(resposta, z.unknown());
}
