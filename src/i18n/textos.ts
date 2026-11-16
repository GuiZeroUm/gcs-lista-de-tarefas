import { auth } from "./messages/auth";
import { comum } from "./messages/comum";
import { tarefas } from "./messages/tarefas";

export const textos = { comum, auth, tarefas } as const;
