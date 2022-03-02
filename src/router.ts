import type { Express } from "express"
import path from "path"

import type { Options } from "./types"

import config from "./config"

import { generateRoutes, walkTree } from "./lib"
import { getHandlers, getMethodKey } from "./utils"

const REQUIRE_MAIN_FILE = path.dirname(require.main.filename)

/**
 * Attach routes to an Express app or router instance
 *
 * ```ts
 * createRouter(app)
 * ```
 *
 * @param app An express app or router instance
 * @param options An options object (optional)
 */
const createRouter = <T = Express>(app: T, options: Options = {}): T => {
  const files = walkTree(
    path.join(REQUIRE_MAIN_FILE, options.directory || "routes")
  )

  const routes = generateRoutes(files)

  for (const { url, exports } of routes) {
    const exportedMethods = Object.entries(exports)

    for (const [method, handler] of exportedMethods) {
      const methodKey = getMethodKey(method)
      const handlers = getHandlers(handler)

      if (
        !options.additionalMethods?.includes(methodKey) &&
        !config.DEFAULT_METHOD_EXPORTS.includes(methodKey)
      )
        continue

      app[methodKey](url, ...handlers)
    }

    // wildcard default export route matching
    if (typeof exports.default !== "undefined") {
      ;(app as unknown as Express).all(url, ...getHandlers(exports.default))
    }
  }

  return app
}

export default createRouter
