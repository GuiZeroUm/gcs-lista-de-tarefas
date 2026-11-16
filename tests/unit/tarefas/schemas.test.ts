import { describe, expect, test } from "vitest";
import { esquemaDaLinhaDoBanco, esquemaDosDadosDaTarefa } from "@/features/tarefas/schemas";
import { textos } from "@/i18n/textos";

const MENSAGENS = textos.tarefas.validacao;

function primeiraMensagem(entrada: unknown) {
  const resultado = esquemaDosDadosDaTarefa.safeParse(entrada);
  return resultado.success ? null : resultado.error.issues[0].message;
}

describe("validação dos dados da tarefa", () => {
  test("aceita tarefa válida e remove espaços das pontas", () => {
    const dados = esquemaDosDadosDaTarefa.parse({
      titulo: "  Estudar GCS  ",
      descricao: "  Revisar baselines ",
      prioridade: "alta",
      prazo: "2026-12-01",
    });
    expect(dados).toEqual({
      titulo: "Estudar GCS",
      descricao: "Revisar baselines",
      prioridade: "alta",
      prazo: "2026-12-01",
    });
  });

  test("prazo vazio vira nulo", () => {
    const dados = esquemaDosDadosDaTarefa.parse({ titulo: "Ler", descricao: "", prioridade: "baixa", prazo: "" });
    expect(dados.prazo).toBeNull();
  });

  test("prazo com data inexistente é recusado", () => {
    expect(primeiraMensagem({ titulo: "Ok", descricao: "", prioridade: "media", prazo: "2026-02-30" })).toBe(
      MENSAGENS.prazoInvalido,
    );
  });

  test("descrição vazia vira nula", () => {
    const dados = esquemaDosDadosDaTarefa.parse({ titulo: "Ler", descricao: "   ", prioridade: "baixa", prazo: "" });
    expect(dados.descricao).toBeNull();
  });

  test("título só com espaços é recusado", () => {
    expect(primeiraMensagem({ titulo: "   ", descricao: "", prioridade: "media", prazo: "" })).toBe(
      MENSAGENS.tituloObrigatorio,
    );
  });

  test("título com mais de 120 caracteres é recusado", () => {
    expect(primeiraMensagem({ titulo: "a".repeat(121), descricao: "", prioridade: "media", prazo: "" })).toBe(
      MENSAGENS.tituloLongo,
    );
  });

  test("título com exatamente 120 caracteres é aceito", () => {
    expect(primeiraMensagem({ titulo: "a".repeat(120), descricao: "", prioridade: "media", prazo: "" })).toBeNull();
  });

  test("descrição com mais de 1000 caracteres é recusada", () => {
    expect(primeiraMensagem({ titulo: "Ok", descricao: "b".repeat(1001), prioridade: "media", prazo: "" })).toBe(
      MENSAGENS.descricaoLonga,
    );
  });

  test("prioridade fora da lista é recusada", () => {
    expect(primeiraMensagem({ titulo: "Ok", descricao: "", prioridade: "urgente", prazo: "" })).toBe(
      MENSAGENS.prioridadeInvalida,
    );
  });
});

describe("leitura da linha do banco", () => {
  test("converte colunas do banco para o formato do domínio", () => {
    const tarefa = esquemaDaLinhaDoBanco.parse({
      id: "6f1c2a8e-4d5b-4c3a-9e7f-1a2b3c4d5e6f",
      usuario_id: "ignorado",
      titulo: "Pagar boleto",
      descricao: null,
      prioridade: "media",
      concluida: true,
      prazo: "2026-11-20",
      criada_em: "2026-11-16T12:00:00Z",
    });
    expect(tarefa).toEqual({
      id: "6f1c2a8e-4d5b-4c3a-9e7f-1a2b3c4d5e6f",
      titulo: "Pagar boleto",
      descricao: null,
      prioridade: "media",
      concluida: true,
      prazo: "2026-11-20",
      criadaEm: "2026-11-16T12:00:00Z",
    });
  });

  test("recusa linha com prioridade desconhecida", () => {
    const resultado = esquemaDaLinhaDoBanco.safeParse({
      id: "6f1c2a8e-4d5b-4c3a-9e7f-1a2b3c4d5e6f",
      titulo: "x",
      descricao: null,
      prioridade: "urgente",
      concluida: false,
      criada_em: "2026-11-16T12:00:00Z",
    });
    expect(resultado.success).toBe(false);
  });
});
