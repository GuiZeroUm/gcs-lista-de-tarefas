import { EstruturaDaPagina } from "@/components/layout/EstruturaDaPagina";
import { BotaoSair } from "@/features/auth/components/BotaoSair";
import { ProtecaoDeRota } from "@/features/auth/components/ProtecaoDeRota";

export default function LayoutAutenticado({ children }: LayoutProps<"/">) {
  return (
    <EstruturaDaPagina acoes={<BotaoSair />}>
      <ProtecaoDeRota>{children}</ProtecaoDeRota>
    </EstruturaDaPagina>
  );
}
