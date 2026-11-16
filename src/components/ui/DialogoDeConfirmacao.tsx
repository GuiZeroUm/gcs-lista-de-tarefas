"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { textos } from "@/i18n/textos";

type Propriedades = {
  estaAberto: boolean;
  titulo: string;
  detalhe: string;
  rotuloDaConfirmacao: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
};

export function DialogoDeConfirmacao({
  estaAberto,
  titulo,
  detalhe,
  rotuloDaConfirmacao,
  aoConfirmar,
  aoCancelar,
}: Propriedades) {
  return (
    <Dialog open={estaAberto} onClose={aoCancelar} fullWidth maxWidth="xs">
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{detalhe}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={aoCancelar}>{textos.comum.cancelar}</Button>
        <Button color="error" variant="contained" onClick={aoConfirmar}>
          {rotuloDaConfirmacao}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
