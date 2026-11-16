"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IndicadorDeCarregamento } from "@/components/ui/IndicadorDeCarregamento";
import { ENDERECOS } from "@/components/layout/enderecos";
import { useSessao } from "../hooks/useSessao";

export function RedirecionarSeLogado({ children }: { children: ReactNode }) {
  const sessao = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (sessao.situacao === "autenticado") router.replace(ENDERECOS.tarefas);
  }, [sessao.situacao, router]);

  if (sessao.situacao !== "anonimo") return <IndicadorDeCarregamento />;
  return children;
}
