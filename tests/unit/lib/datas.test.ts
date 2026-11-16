import { describe, expect, test } from "vitest";
import { formatarData, obterDataDeHoje } from "@/lib/datas";

describe("datas", () => {
  test("formata data ISO como dd/mm/aaaa", () => {
    expect(formatarData("2026-11-05")).toBe("05/11/2026");
  });

  test("data de hoje usa o dia local, sem hora", () => {
    expect(obterDataDeHoje(new Date(2026, 10, 16, 23, 59))).toBe("2026-11-16");
    expect(obterDataDeHoje(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });
});
