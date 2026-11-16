import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/support/configurarTestes.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      include: ["src/features/**", "src/lib/**", "src/components/**"],
      exclude: ["src/components/providers/**"],
      reporter: ["text", "text-summary", "html", "lcov", "json-summary"],
      thresholds: { lines: 85, functions: 85, statements: 85, branches: 75 },
    },
  },
});
