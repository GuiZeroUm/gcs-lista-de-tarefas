import type { AuthError, Session } from "@supabase/supabase-js";
import { ErroDeNegocio, type CodigoDeErro } from "@/lib/erros";
import { obterClienteSupabase } from "@/lib/supabase";
import type { Credenciais, EstadoDaSessao } from "../types";

function converterErroDeAutenticacao(erro: AuthError): ErroDeNegocio {
  const codigosConhecidos: Record<string, CodigoDeErro> = {
    invalid_credentials: "CREDENCIAIS_INVALIDAS",
    user_already_exists: "EMAIL_JA_CADASTRADO",
    email_exists: "EMAIL_JA_CADASTRADO",
  };
  return new ErroDeNegocio(codigosConhecidos[erro.code ?? ""] ?? "FALHA_NA_AUTENTICACAO");
}

export function converterSessao(sessao: Session | null): EstadoDaSessao {
  if (!sessao?.user) return { situacao: "anonimo" };
  return {
    situacao: "autenticado",
    usuario: { id: sessao.user.id, email: sessao.user.email ?? "" },
  };
}

export async function entrar({ email, senha }: Credenciais): Promise<EstadoDaSessao> {
  const { data, error } = await obterClienteSupabase().auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) throw converterErroDeAutenticacao(error);
  return converterSessao(data.session);
}

export async function cadastrar({ email, senha }: Credenciais): Promise<EstadoDaSessao> {
  const { data, error } = await obterClienteSupabase().auth.signUp({ email, password: senha });
  if (error) throw converterErroDeAutenticacao(error);
  return converterSessao(data.session);
}

export async function sair(): Promise<void> {
  const { error } = await obterClienteSupabase().auth.signOut();
  if (error) throw converterErroDeAutenticacao(error);
}

export function observarSessao(aoMudar: (estado: EstadoDaSessao) => void): () => void {
  const { data } = obterClienteSupabase().auth.onAuthStateChange((_evento, sessao) => {
    aoMudar(converterSessao(sessao));
  });
  return () => data.subscription.unsubscribe();
}
