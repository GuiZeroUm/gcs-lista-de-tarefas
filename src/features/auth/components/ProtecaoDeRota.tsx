"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IndicadorDeCarregamento } from "@/components/ui/IndicadorDeCarregamento";
import { ENDERECOS } from "@/components/layout/enderecos";
import { useSessao } from "../hooks/useSessao";
import { ContextoDoUsuario } from "./ContextoDoUsuario";

export function ProtecaoDeRota({ children }: { children: ReactNode }) {
  const sessao = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (sessao.situacao === "anonimo") router.replace(ENDERECOS.entrar);
  }, [sessao.situacao, router]);

  if (sessao.situacao !== "autenticado") return <IndicadorDeCarregamento />;
  return (
    <ContextoDoUsuario.Provider value={sessao.usuario}>{children}</ContextoDoUsuario.Provider>
  );
}
