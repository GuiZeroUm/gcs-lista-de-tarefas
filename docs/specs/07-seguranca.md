# 07 — Segurança

## 1. Regras permanentes

**Sessão e autenticação**
- Sessão guardada no banco, cookie `httpOnly`, `SameSite=Lax`, `Secure` em produção. Nunca token em `localStorage` ou na URL. Ler a sessão por **um único** módulo (ex.: `src/lib/auth/sessao.ts`).
- Senhas com hash forte (argon2id; no Bun, `Bun.password.hash`). Mínimo 8 caracteres, com letra e número.
- Códigos de verificação (cadastro, recuperação): aleatórios, guardados com hash, expiram (~10 min), tentativas limitadas, uso único. Nunca aceite "qualquer código".
- Limite de tentativas em login e códigos (por e-mail e por IP).
- OAuth com `state` e PKCE.
- Redirecionamento pós-login (`?destino=`) só aceita caminho interno (começa com `/` e não com `//`), para não virar *open redirect*.

**Autorização**
- Toda Server Action e Route Handler confere: sessão válida → permissão sobre o recurso (dono, convidado, participante) → só então executa.
- A regra de permissão fica em `features/<x>/server/permissoes.ts`, nunca espalhada.
- WebSocket valida a sessão pelo cookie no `upgrade` e a permissão no recurso ao entrar (spec 09).

**Entradas**
- Tudo que vem de fora passa por zod (tamanho máximo, formato, enums).
- Uploads: lista de extensões e MIME permitidos, tamanho máximo, nome de arquivo gerado no servidor (nunca o nome enviado como caminho). Bloquear `..` e caminhos absolutos.
- Arquivos servidos com `Content-Type` correto, `X-Content-Type-Options: nosniff` e só para quem tem acesso.
- Nada de `dangerouslySetInnerHTML` com conteúdo do usuário.

**Segredos e cabeçalhos**
- Segredos só em `.env` (fora do git), lidos pelo módulo de ambiente.
- Cabeçalhos no `next.config.ts`: `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (câmera/microfone/tela só no próprio site, se usados).
- Logs nunca imprimem senha, token, código de verificação ou dados de terceiros.

## 2. Varredura obrigatória ao fim de cada feature

Ao terminar uma feature, faça a varredura nos arquivos alterados (e no que eles tocam) e **relate ao usuário**:

1. **Autenticação e autorização:** alguma ação ou rota pode ser chamada sem sessão ou sem permissão (IDOR: trocar o ID na URL dá acesso a dado de outro)?
2. **Injeção:** SQL cru (`$queryRawUnsafe`), comandos de shell, caminhos montados com entrada do usuário, HTML não escapado (XSS).
3. **Validação:** toda entrada passa por zod com limites de tamanho?
4. **Uploads e arquivos:** tipo, tamanho, caminho e controle de acesso.
5. **Segredos:** algo sensível no código, no log, no cliente (`NEXT_PUBLIC_*`) ou na resposta?
6. **Tempo real:** mensagens validadas e restritas ao recurso e ao papel?
7. **Abuso:** falta limite de tentativas, de tamanho ou de frequência?
8. **Dependências:** `bun audit` (ou equivalente) sem vulnerabilidade alta.

Formato do relatório:

| Gravidade | Onde | Problema | Melhoria sugerida |
|---|---|---|---|
| Alta / Média / Baixa | `arquivo.ts:linha` | o que pode ser explorado | como corrigir |

Gravidade **alta** é corrigida antes do commit que fecha a feature. As demais viram issue com o rótulo `seguranca`.
