import { Router } from "express"

import type { Options } from "./types"

import createRouter from "./router"

export default createRouter

export { createRouter }

/**
 * Routing middleware
 *
 * ```ts
 * app.use("/", await router())
 * ```
 *
 * @param options An options object (optional)
 */
export const router = async (options: Options = {}) => {
  return await createRouter(Router(), options)
}

export { Options }
