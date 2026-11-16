import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { EstruturaDaPagina } from "@/components/layout/EstruturaDaPagina";
import { textos } from "@/i18n/textos";
import { renderizarComTema } from "../../support/renderizarComTema";

describe("estrutura da página", () => {
  test("mostra o nome do app, o conteúdo e as ações", () => {
    renderizarComTema(
      <EstruturaDaPagina acoes={<button>ação extra</button>}>conteúdo principal</EstruturaDaPagina>,
    );
    expect(screen.getByText(textos.comum.nomeDoApp)).toBeInTheDocument();
    expect(screen.getByText("conteúdo principal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ação extra" })).toBeInTheDocument();
  });

  test("permite trocar o tema para escuro", async () => {
    renderizarComTema(<EstruturaDaPagina>conteúdo</EstruturaDaPagina>);
    await userEvent.click(screen.getByRole("combobox", { name: textos.comum.tema.rotulo }));
    await userEvent.click(screen.getByRole("option", { name: textos.comum.tema.escuro }));
    expect(screen.getByRole("combobox", { name: textos.comum.tema.rotulo })).toHaveTextContent(
      textos.comum.tema.escuro,
    );
  });

});
