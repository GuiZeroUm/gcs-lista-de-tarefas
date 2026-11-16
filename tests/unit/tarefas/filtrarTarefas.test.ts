import { describe, expect, test } from "vitest";
import { contarPorSituacao, filtrarTarefas } from "@/features/tarefas/rules/filtrarTarefas";
import { criarTarefaDeExemplo } from "../../support/fabricas";

const pendente = criarTarefaDeExemplo({ titulo: "pendente" });
const outraPendente = criarTarefaDeExemplo({ titulo: "outra pendente" });
const concluida = criarTarefaDeExemplo({ titulo: "concluida", concluida: true });
const TODAS = [pendente, concluida, outraPendente];

const titulos = (tarefas: { titulo: string }[]) => tarefas.map((tarefa) => tarefa.titulo);

describe("filtro por situação", () => {
  test("todas devolve a lista inteira", () => {
    expect(filtrarTarefas(TODAS, "todas")).toEqual(TODAS);
  });

  test("pendentes devolve só as não concluídas", () => {
    expect(titulos(filtrarTarefas(TODAS, "pendentes"))).toEqual(["pendente", "outra pendente"]);
  });

  test("concluídas devolve só as concluídas", () => {
    expect(titulos(filtrarTarefas(TODAS, "concluidas"))).toEqual(["concluida"]);
  });

  test("conta as tarefas de cada filtro", () => {
    expect(contarPorSituacao(TODAS)).toEqual({ todas: 3, pendentes: 2, concluidas: 1 });
  });
});
