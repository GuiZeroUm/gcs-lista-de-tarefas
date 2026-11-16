"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { ENDERECOS } from "@/components/layout/enderecos";
import { textos } from "@/i18n/textos";
import { sair } from "../services/autenticacao";

export function BotaoSair() {
  const router = useRouter();
  const [estaSaindo, setEstaSaindo] = useState(false);

  async function sairDaConta() {
    setEstaSaindo(true);
    try {
      await sair();
    } catch (erro) {
      console.error("Falha ao encerrar a sessão no Supabase", erro);
    } finally {
      router.replace(ENDERECOS.entrar);
    }
  }

  return (
    <Button color="inherit" startIcon={<LogoutIcon />} onClick={sairDaConta} disabled={estaSaindo}>
      {textos.auth.botaoSair}
    </Button>
  );
}
