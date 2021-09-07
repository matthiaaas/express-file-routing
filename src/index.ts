import { Router } from "express"

import type { IOptions, Handler } from "./types"

import { defaultOptions } from "./options"
import createRouter from "./createRouter"

export default createRouter

export { createRouter }

/**
 * Routing middleware
 *
 * ```ts
 * app.use("/", router())
 * ```
 *
 * @param opts - An options object
 * @returns Express Router object
 */
export const router = (opts: IOptions = defaultOptions) => {
  return createRouter(Router(), opts)
}

export type { Handler }
