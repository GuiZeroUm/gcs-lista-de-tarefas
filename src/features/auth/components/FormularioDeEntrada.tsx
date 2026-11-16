"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ENDERECOS } from "@/components/layout/enderecos";
import { textos } from "@/i18n/textos";
import { traduzirErro } from "@/lib/erros";
import { esquemaDeCadastro, esquemaDeEntrada } from "../schemas";
import { cadastrar, entrar } from "../services/autenticacao";

type Modo = "entrar" | "cadastrar";
type Aviso = { tipo: "error" | "info"; mensagem: string } | null;

const TEXTOS = textos.auth;

export function FormularioDeEntrada() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aviso, setAviso] = useState<Aviso>(null);
  const [estaEnviando, setEstaEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const esquema = modo === "entrar" ? esquemaDeEntrada : esquemaDeCadastro;
    const validacao = esquema.safeParse({ email, senha });
    if (!validacao.success) {
      setAviso({ tipo: "error", mensagem: validacao.error.issues[0].message });
      return;
    }
    setEstaEnviando(true);
    setAviso(null);
    try {
      const acao = modo === "entrar" ? entrar : cadastrar;
      const sessao = await acao(validacao.data);
      if (sessao.situacao === "autenticado") router.replace(ENDERECOS.tarefas);
      else setAviso({ tipo: "info", mensagem: TEXTOS.confirmeSeuEmail });
    } catch (erro) {
      setAviso({ tipo: "error", mensagem: traduzirErro(erro) });
    } finally {
      setEstaEnviando(false);
    }
  }

  const rotuloDoBotao = modo === "entrar" ? TEXTOS.botaoEntrar : TEXTOS.botaoCadastrar;

  return (
    <Paper variant="outlined" className="flex w-full max-w-md flex-col gap-4 p-6">
      <Typography variant="h1">{textos.comum.nomeDoApp}</Typography>
      <Typography color="text.secondary">{TEXTOS.subtitulo}</Typography>
      <Tabs value={modo} onChange={(_evento, novoModo: Modo) => setModo(novoModo)} variant="fullWidth">
        <Tab value="entrar" label={TEXTOS.tituloEntrar} />
        <Tab value="cadastrar" label={TEXTOS.tituloCadastro} />
      </Tabs>
      <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
        <TextField
          label={TEXTOS.email}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          required
        />
        <TextField
          label={TEXTOS.senha}
          type="password"
          autoComplete={modo === "entrar" ? "current-password" : "new-password"}
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          required
        />
        {aviso && <Alert severity={aviso.tipo}>{aviso.mensagem}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={estaEnviando}>
          {rotuloDoBotao}
        </Button>
      </form>
    </Paper>
  );
}
