"use client";

import { useState, type FormEvent } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { textos } from "@/i18n/textos";
import { esquemaDosDadosDaTarefa, TAMANHO_MAXIMO_DO_TITULO } from "../schemas";
import { PRIORIDADES, type DadosDaTarefa, type Prioridade } from "../types";

const TEXTOS = textos.tarefas;

export const VALORES_DE_UMA_NOVA_TAREFA: DadosDaTarefa = {
  titulo: "",
  descricao: null,
  prioridade: "media",
};

type Propriedades = {
  valoresIniciais?: DadosDaTarefa;
  rotuloDoBotao: string;
  aoSalvar: (dados: DadosDaTarefa) => Promise<boolean>;
  limparAoSalvar?: boolean;
};

export function FormularioDeTarefa({
  valoresIniciais = VALORES_DE_UMA_NOVA_TAREFA,
  rotuloDoBotao,
  aoSalvar,
  limparAoSalvar = false,
}: Propriedades) {
  const [titulo, setTitulo] = useState(valoresIniciais.titulo);
  const [descricao, setDescricao] = useState(valoresIniciais.descricao ?? "");
  const [prioridade, setPrioridade] = useState<Prioridade>(valoresIniciais.prioridade);
  const [erroDoTitulo, setErroDoTitulo] = useState<string | null>(null);
  const [estaSalvando, setEstaSalvando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const validacao = esquemaDosDadosDaTarefa.safeParse({ titulo, descricao, prioridade });
    if (!validacao.success) {
      setErroDoTitulo(validacao.error.issues[0].message);
      return;
    }
    setErroDoTitulo(null);
    setEstaSalvando(true);
    const salvou = await aoSalvar(validacao.data);
    setEstaSalvando(false);
    if (salvou && limparAoSalvar) {
      setTitulo("");
      setDescricao("");
      setPrioridade(VALORES_DE_UMA_NOVA_TAREFA.prioridade);
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={enviar} noValidate>
      <TextField
        label={TEXTOS.campoTitulo}
        value={titulo}
        onChange={(evento) => setTitulo(evento.target.value)}
        error={erroDoTitulo !== null}
        helperText={erroDoTitulo}
        slotProps={{ htmlInput: { maxLength: TAMANHO_MAXIMO_DO_TITULO } }}
        required
      />
      <TextField
        label={TEXTOS.campoDescricao}
        value={descricao}
        onChange={(evento) => setDescricao(evento.target.value)}
        multiline
        minRows={2}
      />
      <TextField
        select
        label={TEXTOS.campoPrioridade}
        value={prioridade}
        onChange={(evento) => setPrioridade(evento.target.value as Prioridade)}
      >
        {PRIORIDADES.map((opcao) => (
          <MenuItem key={opcao} value={opcao}>
            {TEXTOS.prioridades[opcao]}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" disabled={estaSalvando}>
        {rotuloDoBotao}
      </Button>
    </form>
  );
}
