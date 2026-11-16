import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { navegacaoFalsa } from "./navegacaoFalsa";
import { reiniciarSupabaseFalso, supabase } from "./usarSupabaseFalso";

vi.mock("next/navigation", () => ({
  useRouter: () => navegacaoFalsa,
}));

vi.mock("@/lib/supabase", () => ({
  obterClienteSupabase: () => supabase.atual,
}));

beforeEach(() => {
  reiniciarSupabaseFalso();
});

afterEach(() => {
  cleanup();
  navegacaoFalsa.replace.mockReset();
  navegacaoFalsa.push.mockReset();
});
