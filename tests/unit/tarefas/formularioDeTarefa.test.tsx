import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { FormularioDeTarefa } from "@/features/tarefas/components/FormularioDeTarefa";
import { textos } from "@/i18n/textos";
import { renderizarComTema } from "../../support/renderizarComTema";

const TEXTOS = textos.tarefas;

describe("formulário de tarefa", () => {
  test("mostra cada erro de validação no próprio campo", async () => {
    const aoSalvar = vi.fn();
    renderizarComTema(<FormularioDeTarefa rotuloDoBotao="Salvar" aoSalvar={aoSalvar} />);
    fireEvent.change(screen.getByLabelText(TEXTOS.campoDescricao), { target: { value: "x".repeat(1001) } });
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(screen.getByText(TEXTOS.validacao.tituloObrigatorio)).toBeInTheDocument();
    expect(screen.getByText(TEXTOS.validacao.descricaoLonga)).toBeInTheDocument();
    expect(aoSalvar).not.toHaveBeenCalled();
  });

  test("começa preenchido com os valores da tarefa em edição", () => {
    renderizarComTema(
      <FormularioDeTarefa
        rotuloDoBotao="Salvar"
        aoSalvar={vi.fn()}
        valoresIniciais={{ titulo: "Revisar", descricao: "PGC", prioridade: "alta", prazo: "2026-12-01" }}
      />,
    );
    expect(screen.getByLabelText(new RegExp(TEXTOS.campoTitulo))).toHaveValue("Revisar");
    expect(screen.getByLabelText(TEXTOS.campoPrazo)).toHaveValue("2026-12-01");
  });
});
