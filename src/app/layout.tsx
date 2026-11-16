import type { Metadata, Viewport } from "next";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Provedores } from "@/components/providers/Provedores";
import { textos } from "@/i18n/textos";
import { POLITICA_DE_SEGURANCA_DE_CONTEUDO } from "@/lib/politicaDeSeguranca";
import "./globals.css";

export const metadata: Metadata = {
  title: textos.comum.nomeDoApp,
  description: textos.auth.subtitulo,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={POLITICA_DE_SEGURANCA_DE_CONTEUDO} />
        )}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <Provedores>{children}</Provedores>
      </body>
    </html>
  );
}
