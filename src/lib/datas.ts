import dayjs from "dayjs";

export function formatarData(dataIso: string): string {
  return dayjs(dataIso).format("DD/MM/YYYY");
}

export function obterDataDeHoje(agora: Date = new Date()): string {
  return dayjs(agora).format("YYYY-MM-DD");
}
