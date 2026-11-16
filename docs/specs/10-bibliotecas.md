# 10 — Bibliotecas

## Regra

Antes de criar algo do zero, **pesquise** se já existe biblioteca madura que resolva. Critérios, em ordem:

1. Simplicidade.
2. Pouco peso no bundle do cliente (meta 100 no Lighthouse).
3. Licença permissiva (MIT, ISC, Apache-2.0 ou BSD) sem chave de licença paga para produção.
4. Manutenção ativa (release recente).
5. Compatível com a stack (Bun + Next.js + React atuais).

Se nenhuma opção atende, faça o próprio código e registre o motivo na spec 10 do projeto. Confira versão, licença e data no registro do npm (`https://registry.npmjs.org/<pacote>`) e tamanho no bundlephobia/bundlejs **na hora de escolher** — os dados abaixo são de 10/2026.

Cada escolha do projeto é registrada numa tabela: Necessidade | Escolha | Versão | Licença | Por quê, e uma seção com as **descartadas e o motivo**.

## Escolhas já avaliadas (ponto de partida)

| Necessidade | Escolha | Licença | Por quê |
|---|---|---|---|
| Autenticação (e-mail+senha, OTP, OAuth com tokens) | **Better Auth** + adapter Prisma + plugin `emailOTP` (`storeOTP: "hashed"`) | MIT | Sessão no banco, cookie httpOnly assinado, renovação de token OAuth, limite de tentativas. `auth.api.getSession({ headers })` funciona fora do Next. Descartados: Auth.js v5 (beta), Lucia (descontinuado), montar com jose (mais código, mais risco) |
| Hash de senha | **`Bun.password`** (argon2id) | MIT | Nativo, formato PHC. Use as versões assíncronas |
| Validação | **zod 4** (no cliente, `zod/mini`) | MIT | Sem dependências; o pacote inteiro pesa ~89 KB no cliente |
| i18n com idioma em cookie | **next-intl** sem roteamento | MIT | Server e Client Components, ICU, datas. ~13 KB |
| Limite de tentativas | **rate-limiter-flexible** | ISC | Sem dependências; memória agora, Postgres/Redis depois com a mesma API |
| Datas e seletores | **dayjs** + **@mui/x-date-pickers** (só o gratuito, nunca o Pro) | MIT | Visual MUI nativo; carregar com `dynamic()` |
| Upload com arrastar e soltar | **react-dropzone** + fila própria com `XMLHttpRequest` | MIT | ~6 KB; `fetch` não informa progresso de upload |
| Estado de cliente com muitos eventos | **zustand** | MIT | ~0,5 KB; seletores evitam re-render |
| API do Google (Agenda etc.) | **`fetch` direto** à REST + zod na resposta | — | `googleapis` é enorme; tokens já vêm do Better Auth |
| Gravação de tela/áudio | **`MediaRecorder` nativo** + Web Audio | — | Bibliotecas antigas (RecordRTC) sem manutenção |
| Medidor de volume / alto-falante | **Web Audio `AnalyserNode`** + `setSinkId` | — | Poucas linhas, zero KB |
| WebRTC | **`RTCPeerConnection` nativo** (*perfect negotiation*) | — | simple-peer parado; PeerJS acopla ao servidor dele |
| Renderizar PDF no navegador | **pdfjs-dist** com `import()` dinâmico | Apache-2.0 | Padrão de mercado, fora do bundle inicial |
| Colaboração em tempo real (texto, presença) | **Yjs + Hocuspocus + Tiptap** | MIT | Roda no próprio servidor e salva no Postgres. Descartados: Liveblocks (nuvem paga/AGPL), Tiptap Cloud |
| Traço de desenho à mão | **perfect-freehand** | MIT | ~2 KB. Quadros prontos: Excalidraw pesado, tldraw exige licença paga |

Antes de adotar: confirme que a versão atual ainda atende aos critérios.
