import { Router } from "express"

import type { Options } from "./types"

import createRouter from "./router"

export default createRouter

export { createRouter }

/**
 * Routing middleware
 *
 * ```ts
 * app.use("/", router())
 * ```
 *
 * @param options An options object (optional)
 */
export const router = (options: Options = {}) => {
  return createRouter(Router(), options)
}

export { Options }
