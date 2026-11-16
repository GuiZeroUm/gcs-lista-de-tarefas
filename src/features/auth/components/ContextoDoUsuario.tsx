"use client";

import { createContext, useContext } from "react";
import type { UsuarioLogado } from "../types";

export const ContextoDoUsuario = createContext<UsuarioLogado | null>(null);

export function useUsuarioLogado(): UsuarioLogado | null {
  return useContext(ContextoDoUsuario);
}
