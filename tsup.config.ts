import { defineConfig } from "tsup";

import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  sourcemap: true,
  dts: true,
  minify: false,
  watch: process.env.NODE_ENV === "development",
});