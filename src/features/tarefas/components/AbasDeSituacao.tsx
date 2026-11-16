"use client";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { textos } from "@/i18n/textos";
import { FILTROS_DE_SITUACAO, type FiltroDeSituacao } from "../types";

const TEXTOS = textos.tarefas;

type Propriedades = {
  filtro: FiltroDeSituacao;
  quantidades: Record<FiltroDeSituacao, number>;
  aoMudar: (filtro: FiltroDeSituacao) => void;
};

export function AbasDeSituacao({ filtro, quantidades, aoMudar }: Propriedades) {
  return (
    <Tabs
      value={filtro}
      onChange={(_evento, novoFiltro: FiltroDeSituacao) => aoMudar(novoFiltro)}
      variant="fullWidth"
    >
      {FILTROS_DE_SITUACAO.map((opcao) => (
        <Tab
          key={opcao}
          value={opcao}
          label={TEXTOS.rotuloDoFiltro(TEXTOS.filtros[opcao], quantidades[opcao])}
        />
      ))}
    </Tabs>
  );
}
