import { defineConfig, globalIgnores } from "eslint/config"
import ts from "typescript-eslint"
import js from "@eslint/js"

export default defineConfig([
  globalIgnores([
    "**/node_modules/",
    "**/dist/",
    "**/examples/",
    "**/rollup.config.mjs"
  ]),
  js.configs.recommended,
  ts.configs.recommended,
  {
    rules: {
      "no-console": "error"
    }
  }
])
