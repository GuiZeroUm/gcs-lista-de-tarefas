# 05 — Tema e estilo

## 1. Um único lugar para valores visuais

- **Todas as cores** ficam em `src/theme/cores.ts`. Mudou ali, muda no sistema inteiro (claro e escuro).
- Tipografia em `src/theme/tipografia.ts`; raios, sombras e espaçamentos especiais em `src/theme/medidas.ts`.
- `src/theme/temaMui.ts` monta o tema do MUI a partir desses arquivos, com `cssVariables: true` (o MUI publica as cores como `--mui-palette-*`).
- `src/app/globals.css` liga o Tailwind a essas mesmas variáveis (`@theme`), então classes como `bg-primaria` ou `text-texto-fraco` usam a mesma fonte da verdade.

**Proibido** em componentes: hexadecimal, `rgb()`, nomes de cor (`"red"`), tamanhos de fonte soltos e sombras escritas à mão. Use a paleta do tema (`color="primary"`, `sx={{ color: "text.secondary" }}`) ou as classes do Tailwind ligadas ao tema.

## 2. MUI x Tailwind

| Use MUI para | Use Tailwind para |
|---|---|
| Componentes interativos: `Button`, `TextField`, `Select`, `Dialog`, `Menu`, `Tabs`, `Table`, `Switch`, `Checkbox`, `Tooltip`, `Snackbar` | Layout: `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`, `overflow-*`, responsividade (`md:`) |
| Variantes e estados (hover, foco, desabilitado) definidos no tema | Posicionamento simples de blocos |

- Estilo de componente MUI se ajusta **no tema** (`theme.components.MuiButton`), não repetido em cada uso.
- Evite `sx` grande; se o mesmo `sx` aparece 2 vezes, vira variante no tema ou componente em `src/components/`.
- Tailwind com `preflight` desligado (o `CssBaseline` do MUI faz o reset) e `important` no seletor do app para conviver com o Emotion.

## 3. Identidade visual (preencher no projeto)

A spec do projeto registra: paleta (com os pares de contraste AA), fonte, formas (raios por tipo de componente), variantes de botão, família de ícones e estrutura de navegação (barra superior, trilho no desktop, barra inferior no celular). Base recomendada: **Material 3**.

Regras que valem sempre:

- **Celular primeiro:** toda tela funciona em 360px sem rolagem horizontal, com alvos de toque de pelo menos 44px. Modais viram *bottom sheet* abaixo de `sm`.
- Ícones `@mui/icons-material` importados por caminho. Não use fontes de ícone por CSS externo (bloqueante, spec 04).
- Componentes de UI compartilhados em `src/components/ui/` e listados na spec 12 do projeto.

## 4. Modo escuro

- Três opções: **Claro**, **Escuro** e **Automático** (segue o sistema).
- `colorSchemes` do MUI (`light`/`dark`) com seletor de atributo no `<html>`. Cada cor de `cores.ts` define os dois valores.
- O Tailwind usa as mesmas variáveis: funciona nos dois modos sem classe `dark:`.

## 5. Textos e idiomas

- Nenhum texto visível escrito direto no componente. Cada feature tem `src/i18n/messages/<feature>.ts`, lido com `useTranslations` (cliente) ou `getTranslations` (servidor).
- Toda cor de texto tem contraste **AA** (4,5:1) com o fundo em que aparece.
- Idioma padrão: **pt-BR**. A escolha fica em cookie, para o servidor já renderizar no idioma certo.
