import { EstruturaDaPagina } from "@/components/layout/EstruturaDaPagina";
import { FormularioDeEntrada } from "./FormularioDeEntrada";
import { RedirecionarSeLogado } from "./RedirecionarSeLogado";

export function TelaDeEntrada() {
  return (
    <EstruturaDaPagina>
      <RedirecionarSeLogado>
        <div className="flex flex-1 items-center justify-center">
          <FormularioDeEntrada />
        </div>
      </RedirecionarSeLogado>
    </EstruturaDaPagina>
  );
}
