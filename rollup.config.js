import typescript from "rollup-plugin-typescript2"

import pkg from "./package.json"

/**
 * @type {import("rollup").RollupOptions}
 */
export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.module,
      format: "esm",
      exports: "named",
      sourcemap: true,
      strict: false,
      esModule: true
    },
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [typescript()],
  external: ["express", "path", "fs"]
}
