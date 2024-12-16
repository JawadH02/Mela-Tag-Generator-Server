import { defineConfig } from "tsup";

import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  target: "es6",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  external: ["express", "dotenv"], // Keep external dependencies unbundled
});