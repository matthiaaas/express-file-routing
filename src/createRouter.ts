import { Router } from "express"
import path from "path"

import type { IOptions } from "./types"

import config from "./config"
import { defaultOptions, REQUIRE_MAIN_FILE, verboseTypes } from "./options"
import { walk, generateRoutes, getHandlers, getMethodKey, log } from "./utils"

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
  /**
   * Bug: ENOENT: no such file or directory, scandir 'api'
   */
  if (opts.directory && defaultOptions.directory !== opts.directory) {
    opts.directory = path.join(REQUIRE_MAIN_FILE, opts.directory)

    if (!opts.base) opts.base = opts.directory.replace(REQUIRE_MAIN_FILE, "")
  }

  if (opts.verbose === "dev") opts.verbose = verboseTypes["dev"]

  const options = { ...defaultOptions, ...opts }

  const files = walk(options.directory)
  const routes = generateRoutes(files)

  if (options.verbose) {
    console.log(
      "\x1b[36m",
      "\n[Function: createRouter]:",
      options.directory.replace(REQUIRE_MAIN_FILE, ""),
      "\x1b[0m"
    )
  }

  for (const { url, exported } of routes) {
    const exportedMethods = Object.entries(exported)

    for (const [method, handler] of exportedMethods) {
      const methodKey = getMethodKey(method)
      const handlers = getHandlers(handler)

      if (
        !options.methodExports.includes(methodKey) &&
        !config.METHOD_EXPORTS.includes(methodKey)
      )
        continue

      app[methodKey](url, ...handlers)

      if (options.verbose)
        log(`[${methodKey}]`, options.base + url, exported.priority || 0)
    }

    // wildcard default export route matching
    if (typeof exported.default !== "undefined") {
      ;(app as unknown as Router).all(url, ...getHandlers(exported.default))

      if (options.verbose)
        log(`[_all]`, options.base + url, exported.priority || 0)
    }
  }

  return app
}

export default createRouter
