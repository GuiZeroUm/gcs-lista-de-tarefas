"use client";

import { useEffect, useState } from "react";
import { observarSessao } from "../services/autenticacao";
import type { EstadoDaSessao } from "../types";

export function useSessao(): EstadoDaSessao {
  const [estado, setEstado] = useState<EstadoDaSessao>({ situacao: "carregando" });
  useEffect(() => observarSessao(setEstado), []);
  return estado;
}
