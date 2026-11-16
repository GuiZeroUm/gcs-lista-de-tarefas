import { z } from "zod";
import { textos } from "@/i18n/textos";
import { PRIORIDADES, type Tarefa } from "./types";

const mensagens = textos.tarefas.validacao;

export const TAMANHO_MAXIMO_DO_TITULO = 120;
export const TAMANHO_MAXIMO_DA_DESCRICAO = 1000;

export const esquemaDosDadosDaTarefa = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, mensagens.tituloObrigatorio)
    .max(TAMANHO_MAXIMO_DO_TITULO, mensagens.tituloLongo),
  descricao: z
    .string()
    .trim()
    .max(TAMANHO_MAXIMO_DA_DESCRICAO, mensagens.descricaoLonga)
    .transform((texto) => (texto === "" ? null : texto)),
  prioridade: z.enum(PRIORIDADES, mensagens.prioridadeInvalida),
});

export const esquemaDaLinhaDoBanco = z
  .object({
    id: z.uuid(),
    titulo: z.string(),
    descricao: z.string().nullable(),
    prioridade: z.enum(PRIORIDADES),
    concluida: z.boolean(),
    criada_em: z.string(),
  })
  .transform(
    (linha): Tarefa => ({
      id: linha.id,
      titulo: linha.titulo,
      descricao: linha.descricao,
      prioridade: linha.prioridade,
      concluida: linha.concluida,
      criadaEm: linha.criada_em,
    }),
  );
