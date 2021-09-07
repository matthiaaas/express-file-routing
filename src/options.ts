import path from "path"

import type { IOptions } from "./types"

export const REQUIRE_MAIN_FILE = path.dirname(require.main.filename)

export const verboseTypes = {
  false: false,
  dev: process.env.NODE_ENV !== "production",
  true: true
}

export const defaultOptions: IOptions = {
  directory: path.join(REQUIRE_MAIN_FILE, "routes"),
  methodExports: [],
  verbose: false
}
