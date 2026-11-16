import { randomUUID } from "node:crypto";

type LinhaDaTarefa = Record<string, unknown> & { id: string; usuario_id: string };
type Resposta = { data: unknown; error: { code?: string; message: string } | null };
type Sessao = { user: { id: string; email: string } } | null;
type OuvinteDeSessao = (evento: string, sessao: Sessao) => void;
type Usuario = { id: string; email: string; senha: string };

const COLUNAS_PADRAO = { descricao: null, prioridade: "media", concluida: false };

class ConsultaFalsa implements PromiseLike<Resposta> {
  private filtroPorId: string | null = null;
  private deveRetornarUmaLinha = false;

  constructor(
    private readonly banco: SupabaseFalso,
    private readonly operacao: "select" | "insert" | "update" | "delete",
    private readonly valores: Record<string, unknown> = {},
  ) {}

  select() {
    return this;
  }
  order() {
    return this;
  }
  limit() {
    return this;
  }
  eq(_coluna: "id", valor: string) {
    this.filtroPorId = valor;
    return this;
  }
  single() {
    this.deveRetornarUmaLinha = true;
    return this;
  }

  then<R1 = Resposta, R2 = never>(
    aoResolver?: ((resposta: Resposta) => R1 | PromiseLike<R1>) | null,
    aoRejeitar?: ((motivo: unknown) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return Promise.resolve(this.executar()).then(aoResolver, aoRejeitar);
  }

  private executar(): Resposta {
    if (this.banco.proximoErro) {
      const erro = this.banco.proximoErro;
      this.banco.proximoErro = null;
      return { data: null, error: erro };
    }
    const linhas = this.banco.executarOperacao(this.operacao, this.valores, this.filtroPorId);
    if (!this.deveRetornarUmaLinha) return { data: linhas, error: null };
    if (linhas.length !== 1) return { data: null, error: { code: "PGRST116", message: "0 rows" } };
    return { data: linhas[0], error: null };
  }
}

export class SupabaseFalso {
  linhas: LinhaDaTarefa[] = [];
  usuarios: Usuario[] = [];
  sessao: Sessao = null;
  proximoErro: Resposta["error"] = null;
  erroDeAutenticacao: { code: string; message: string } | null = null;
  private ouvintes = new Set<OuvinteDeSessao>();
  private relogio = 0;

  auth = {
    onAuthStateChange: (ouvinte: OuvinteDeSessao) => {
      this.ouvintes.add(ouvinte);
      queueMicrotask(() => ouvinte("INITIAL_SESSION", this.sessao));
      return { data: { subscription: { unsubscribe: () => this.ouvintes.delete(ouvinte) } } };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const usuario = this.usuarios.find((conta) => conta.email === email && conta.senha === password);
      if (this.erroDeAutenticacao || !usuario) {
        return { data: { session: null }, error: this.erroDeAutenticacao ?? { code: "invalid_credentials", message: "Invalid login credentials" } };
      }
      return { data: { session: this.iniciarSessao(usuario) }, error: null };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      if (this.usuarios.some((conta) => conta.email === email)) {
        return { data: { session: null }, error: { code: "user_already_exists", message: "User already registered" } };
      }
      const usuario = { id: randomUUID(), email, senha: password };
      this.usuarios.push(usuario);
      return { data: { session: this.iniciarSessao(usuario) }, error: null };
    },
    signOut: async () => {
      this.mudarSessao("SIGNED_OUT", null);
      return { error: this.erroDeAutenticacao };
    },
  };

  from() {
    return {
      select: () => new ConsultaFalsa(this, "select"),
      insert: (valores: Record<string, unknown>) => new ConsultaFalsa(this, "insert", valores),
      update: (valores: Record<string, unknown>) => new ConsultaFalsa(this, "update", valores),
      delete: () => new ConsultaFalsa(this, "delete"),
    };
  }

  cadastrarUsuario(email: string, senha: string) {
    const usuario = { id: randomUUID(), email, senha };
    this.usuarios.push(usuario);
    return usuario;
  }

  entrarComo(email: string) {
    const usuario = this.usuarios.find((conta) => conta.email === email);
    if (!usuario) throw new Error(`usuário ${email} não cadastrado no Supabase falso`);
    this.iniciarSessao(usuario);
  }

  mudarSessao(evento: string, sessao: Sessao) {
    this.sessao = sessao;
    this.ouvintes.forEach((ouvinte) => ouvinte(evento, sessao));
  }

  executarOperacao(
    operacao: "select" | "insert" | "update" | "delete",
    valores: Record<string, unknown>,
    id: string | null,
  ): LinhaDaTarefa[] {
    // Simula o Row Level Security: cada usuário só alcança as próprias linhas.
    const usuarioId = this.sessao?.user.id;
    if (!usuarioId) return [];
    const doUsuario = (linha: LinhaDaTarefa) =>
      linha.usuario_id === usuarioId && (id === null || linha.id === id);
    if (operacao === "insert") return [this.inserir(valores, usuarioId)];
    const alcancadas = this.linhas.filter(doUsuario);
    if (operacao === "update") alcancadas.forEach((linha) => Object.assign(linha, semIndefinidos(valores)));
    if (operacao === "delete") this.linhas = this.linhas.filter((linha) => !doUsuario(linha));
    if (operacao === "select") return [...alcancadas].sort(maisRecentePrimeiro);
    return alcancadas;
  }

  private inserir(valores: Record<string, unknown>, usuarioId: string): LinhaDaTarefa {
    this.relogio += 1;
    const linha: LinhaDaTarefa = {
      ...COLUNAS_PADRAO,
      ...semIndefinidos(valores),
      id: randomUUID(),
      usuario_id: usuarioId,
      criada_em: new Date(Date.UTC(2026, 10, 16, 12, 0, this.relogio)).toISOString(),
    };
    this.linhas.push(linha);
    return linha;
  }

  private iniciarSessao(usuario: Usuario): Sessao {
    const sessao = { user: { id: usuario.id, email: usuario.email } };
    this.mudarSessao("SIGNED_IN", sessao);
    return sessao;
  }
}

function semIndefinidos(valores: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(valores).filter(([, valor]) => valor !== undefined));
}

function maisRecentePrimeiro(primeira: LinhaDaTarefa, segunda: LinhaDaTarefa) {
  return String(segunda.criada_em).localeCompare(String(primeira.criada_em));
}
