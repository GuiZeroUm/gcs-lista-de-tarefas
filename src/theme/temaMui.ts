"use client";

import { createTheme } from "@mui/material/styles";
import { CORES } from "./cores";
import { MEDIDAS } from "./medidas";
import { TIPOGRAFIA } from "./tipografia";

function montarPaleta(cores: (typeof CORES)[keyof typeof CORES]) {
  return {
    primary: { main: cores.primaria },
    secondary: { main: cores.secundaria },
    error: { main: cores.erro },
    success: { main: cores.sucesso },
    warning: { main: cores.aviso },
    background: { default: cores.fundo, paper: cores.superficie },
    text: { primary: cores.texto, secondary: cores.textoFraco },
  };
}

export const temaMui = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  colorSchemes: {
    light: { palette: montarPaleta(CORES.claro) },
    dark: { palette: montarPaleta(CORES.escuro) },
  },
  typography: {
    fontFamily: TIPOGRAFIA.familia,
    h1: { fontSize: TIPOGRAFIA.tamanhoDoTitulo, fontWeight: 700 },
    h2: { fontSize: TIPOGRAFIA.tamanhoDoSubtitulo, fontWeight: 600 },
  },
  shape: { borderRadius: MEDIDAS.raioDosCartoes },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: MEDIDAS.alturaMinimaDoToque,
          borderRadius: MEDIDAS.raioDosBotoes,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: MEDIDAS.alturaMinimaDoToque, minHeight: MEDIDAS.alturaMinimaDoToque },
      },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
  },
});
