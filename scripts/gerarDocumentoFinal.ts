import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const PASTA_DOCS = join(import.meta.dirname, "..", "docs");
const ORIGEM = join(PASTA_DOCS, "DOCUMENTO_FINAL.md");
const HTML_TEMPORARIO = join(PASTA_DOCS, "DOCUMENTO_FINAL.tmp.html");
const DESTINO = join(PASTA_DOCS, "DOCUMENTO_FINAL.pdf");
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js";

const ESTILO = `
  @page { size: A4; margin: 16mm 14mm; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1c1f2b; font-size: 10.5pt; line-height: 1.45; }
  h1 { font-size: 22pt; margin: 0 0 8px; } h2 { font-size: 15pt; border-bottom: 2px solid #3b5bdb; padding-bottom: 4px; margin-top: 22px; }
  h3 { font-size: 12pt; } table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.5pt; }
  th, td { border: 1px solid #c9cedb; padding: 4px 6px; vertical-align: top; text-align: left; } th { background: #eef1fb; }
  code { background: #f1f3f7; padding: 0 3px; border-radius: 3px; font-size: 9pt; } a { color: #3b5bdb; }
  img { max-width: 100%; border: 1px solid #c9cedb; border-radius: 6px; margin: 6px 0 2px; page-break-inside: avoid; }
  blockquote { border-left: 4px solid #3b5bdb; margin: 8px 0; padding: 4px 10px; background: #f6f7fb; }
  hr { border: 0; page-break-after: always; } .capa { text-align: center; padding-top: 180px; page-break-after: always; }
  .capa h1 { font-size: 26pt; } .capa h2 { border: 0; color: #3b5bdb; } .mermaid { text-align: center; page-break-inside: avoid; }
`;

function montarHtml(markdown: string): string {
  const corpo = (marked.parse(markdown, { async: false }) as string).replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_trecho, diagrama: string) => `<div class="mermaid">${diagrama}</div>`,
  );
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Documento final — Minhas Tarefas</title>
<style>${ESTILO}</style><script src="${MERMAID}"></script></head><body>${corpo}
<script>mermaid.initialize({ startOnLoad: true, theme: "default", flowchart: { htmlLabels: true } });</script></body></html>`;
}

function imprimirPdf() {
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=15000",
    `--print-to-pdf=${DESTINO}`,
    `file://${HTML_TEMPORARIO}`,
  ]);
}

writeFileSync(HTML_TEMPORARIO, montarHtml(readFileSync(ORIGEM, "utf8")));
try {
  imprimirPdf();
  console.log(`PDF gerado em ${DESTINO}`);
} finally {
  rmSync(HTML_TEMPORARIO, { force: true });
}
