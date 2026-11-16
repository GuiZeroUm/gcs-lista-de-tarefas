export type UsuarioLogado = {
  id: string;
  email: string;
};

export type EstadoDaSessao =
  | { situacao: "carregando" }
  | { situacao: "anonimo" }
  | { situacao: "autenticado"; usuario: UsuarioLogado };

export type Credenciais = {
  email: string;
  senha: string;
};
