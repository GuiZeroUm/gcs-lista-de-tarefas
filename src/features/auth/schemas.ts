import { z } from "zod";
import { textos } from "@/i18n/textos";

const mensagens = textos.auth.validacao;

const campoEmail = z.string().trim().toLowerCase().pipe(z.email(mensagens.emailInvalido));

export const esquemaDeEntrada = z.object({
  email: campoEmail,
  senha: z.string().min(1, mensagens.senhaObrigatoria),
});

export const esquemaDeCadastro = z.object({
  email: campoEmail,
  senha: z
    .string()
    .min(8, mensagens.senhaCurta)
    .max(72, mensagens.senhaCurta)
    .regex(/[a-zA-Z]/, mensagens.senhaSemLetraOuNumero)
    .regex(/[0-9]/, mensagens.senhaSemLetraOuNumero),
});
