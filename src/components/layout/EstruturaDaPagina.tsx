import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { textos } from "@/i18n/textos";
import { SeletorDeTema } from "./SeletorDeTema";

type Propriedades = {
  acoes?: ReactNode;
  children: ReactNode;
};

export function EstruturaDaPagina({ acoes, children }: Propriedades) {
  return (
    <div className="flex min-h-screen flex-col bg-fundo">
      <header className="flex items-center justify-between gap-3 border-b border-texto-fraco/20 bg-superficie px-4 py-3">
        <Typography variant="h2" component="p">
          {textos.comum.nomeDoApp}
        </Typography>
        <div className="flex items-center gap-2">
          <SeletorDeTema />
          {acoes}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4">{children}</main>
    </div>
  );
}
