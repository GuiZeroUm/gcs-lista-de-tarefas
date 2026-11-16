import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { temaMui } from "@/theme/temaMui";

export function renderizarComTema(elemento: ReactElement) {
  return render(<ThemeProvider theme={temaMui}>{elemento}</ThemeProvider>);
}
