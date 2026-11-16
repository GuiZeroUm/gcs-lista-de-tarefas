import { EstruturaDaPagina } from "@/components/layout/EstruturaDaPagina";
import { IndicadorDeCarregamento } from "@/components/ui/IndicadorDeCarregamento";

export default function PaginaInicial() {
  return (
    <EstruturaDaPagina>
      <IndicadorDeCarregamento />
    </EstruturaDaPagina>
  );
}
