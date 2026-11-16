# 09 — Tempo real

Leia só se o projeto tem WebSocket, colaboração ou vídeo/áudio entre navegadores.

## 1. Arquitetura

- **Um WebSocket por aba**, servido pelo `server.ts` na mesma porta do Next (servidor customizado no Bun).
- Código separado: `src/realtime/protocolo.ts` (tipos e schemas zod de todas as mensagens, fonte da verdade), `src/realtime/constantes.ts` (códigos e limites sem zod, seguros para o cliente), `src/realtime/server/` (hub) e `src/realtime/client/` (conexão do navegador e hook).
- Regras de permissão do hub em funções puras testadas (`src/realtime/server/permissoes.ts` ou `features/<x>/rules/`).

## 2. Conexão

- Sessão lida do **cookie** no `upgrade` (mesma origem), direto do banco, sem cache. Sem sessão: fecha com código próprio (ex.: 4401).
- Revalide a sessão periodicamente (ex.: a cada 60 s); sessão encerrada fecha a conexão.
- Confira o cabeçalho `Origin` (URL pública ou o próprio `Host`); outra origem fecha (ex.: 4403). Impede *cross-site WebSocket hijacking*.
- Depois de conectar, o cliente envia `entrar` com o recurso; o servidor confere a permissão nele.
- Mesmo usuário em outra aba: decida (substituir a antiga ou permitir várias) e documente.
- Reconexão com espera crescente (1s, 2s, 4s… até 10s) e reenvio de `entrar`; o servidor manda um retrato completo.
- Batimento (`ping`) a cada ~30 s; derrube quem não respondeu.
- Tabela de códigos de fechamento na spec do projeto, com a coluna "o cliente reconecta?".

## 3. Mensagens

- Toda mensagem é JSON com campo `tipo`, validada com zod; inválida é descartada e logada. Tamanho máximo definido (ex.: 64 KB).
- Comandos de papel privilegiado (dono/professor/admin) ficam numa lista explícita conferida no servidor.
- O servidor **não ecoa** ao remetente (o cliente aplica a própria alteração na hora), exceto quando ajusta a alteração.
- Estado compartilhado em "espaços" com mescla rasa (chave `null` apaga) e regras de quem altera cada espaço.
- Todo cliente valida com zod os `dados` que recebe de outros clientes.

## 4. Persistência

- Estado em memória durante a sessão, gravado no banco **agrupado** (ex.: a cada 1 s, numa transação).
- Carrega do banco na primeira entrada; grava e libera a memória quando o último sai; grava tudo em `SIGTERM`/`SIGINT` (prazo curto).
- Falha ao gravar: tenta de novo sem perder pendências.
- Módulos do hub compartilhados com o bundle do Next: registre a instância em `globalThis[Symbol.for("<app>.hub")]` para não haver duas cópias.
- Várias instâncias: precisa de canal entre elas (`LISTEN/NOTIFY` do PostgreSQL, Redis). Registre antes de escalar.

## 5. Limites contra abuso

- Mensagens por segundo por conexão (acima: fecha com código que permite reconectar).
- Tamanho máximo por tipo de mensagem; frequência de chat por usuário (`rate-limiter-flexible`).

## 6. Vídeo e áudio (WebRTC)

- API nativa `RTCPeerConnection` com *perfect negotiation* (MDN); sinalização pelo próprio WebSocket.
- Malha serve para poucas dezenas; além disso, SFU (registre antes de trocar).
- Transceptores fixos e `replaceTrack` para trocar dispositivo sem renegociar; `restartIce` quando falha; limite de bitrate conforme a malha cresce.

## 7. Colaboração (texto/presença)

- **Yjs + Hocuspocus** no mesmo `server.ts`, num segundo caminho; editor **Tiptap** com extensões de colaboração.
- Autenticação por documento (`onAuthenticate`), permissão a cada mensagem (`beforeHandleMessage`), servidor reescreve a identidade na presença (`beforeHandleAwareness`).
- Gravação com atraso (debounce + máximo) e limite de tamanho.
