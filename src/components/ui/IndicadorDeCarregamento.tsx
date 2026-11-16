import CircularProgress from "@mui/material/CircularProgress";
import { textos } from "@/i18n/textos";

export function IndicadorDeCarregamento() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <CircularProgress aria-label={textos.comum.carregando} />
    </div>
  );
}
