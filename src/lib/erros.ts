import { textos } from "@/i18n/textos";

export type CodigoDeErro = keyof typeof textos.comum.erros;

export class ErroDeNegocio extends Error {
  constructor(public readonly codigo: CodigoDeErro) {
    super(codigo);
    this.name = "ErroDeNegocio";
  }
}

export function falhar(codigo: CodigoDeErro): never {
  throw new ErroDeNegocio(codigo);
}

export function traduzirErro(erro: unknown): string {
  if (erro instanceof ErroDeNegocio) return textos.comum.erros[erro.codigo];
  return textos.comum.erros.FALHA_NO_BANCO;
}
