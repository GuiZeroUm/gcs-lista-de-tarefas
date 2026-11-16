"use client";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useColorScheme } from "@mui/material/styles";
import { textos } from "@/i18n/textos";

const OPCOES_DE_TEMA = [
  { valor: "light", rotulo: textos.comum.tema.claro },
  { valor: "dark", rotulo: textos.comum.tema.escuro },
  { valor: "system", rotulo: textos.comum.tema.automatico },
] as const;

type ModoDoTema = (typeof OPCOES_DE_TEMA)[number]["valor"];

export function SeletorDeTema() {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;
  return (
    <TextField
      select
      size="small"
      label={textos.comum.tema.rotulo}
      value={mode}
      onChange={(evento) => setMode(evento.target.value as ModoDoTema)}
    >
      {OPCOES_DE_TEMA.map((opcao) => (
        <MenuItem key={opcao.valor} value={opcao.valor}>
          {opcao.rotulo}
        </MenuItem>
      ))}
    </TextField>
  );
}
