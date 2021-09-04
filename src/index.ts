import path from "path"
import { Router } from "express"

import config from "./config"

import { walk, generateRoutes, getHandlers, getMethodKey } from "./utils"

/**
 * Routing factory
 *
 * ```ts
 * createRouter(app)
 * ```
 *
 * @param app - An express app or router instance
 * @param opts - An options object
 */
const createRouter = <T>(app: T, opts: IOptions = defaultOptions): T => {
  const options = { ...defaultOptions, ...opts }

  const files = walk(options.directory)
  const routes = generateRoutes(files)

  for (const { url, exported } of routes) {
    const exportedMethods = Object.entries(exported)

    for (const [method, handler] of exportedMethods) {
      const methodKey = getMethodKey(method)
      const handlers = getHandlers(handler)

      if (
        !opts.methodExports.includes(methodKey) &&
        !config.METHOD_EXPORTS.includes(methodKey)
      )
        continue

      app[methodKey](url, ...handlers)
    }
    // wildcard default export route matching
    if (typeof exported.default !== "undefined") {
      ;(app as unknown as Router).all(url, ...getHandlers(exported.default))
    }
  }

  return app
}

export default createRouter

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

interface IOptions {
  directory?: string
  methodExports?: string[]
}

const defaultOptions: IOptions = {
  directory: path.join(path.dirname(require.main.filename), "routes"),
  methodExports: []
}
