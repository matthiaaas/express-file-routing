import path from "path"
import { Router } from "express"

import config from "./config"

import { walk, generateRoutes, getHandlers } from "./utils"

interface IOptions {
  directory?: string
  methodExports?: string[]
}

export default (opts: IOptions = defaultOptions): Router => {
  const options = { ...defaultOptions, ...opts }

  const router = Router({ mergeParams: true })

  const files = walk(options.directory)
  const routes = generateRoutes(files)

  for (const { url, exported } of routes) {
    const exportedMethods = Object.entries(exported)
    for (const [method, handler] of exportedMethods) {
      const methodKey = method.toLowerCase()
      const handlers = getHandlers(handler)
      if (
        !opts.methodExports.includes(methodKey) &&
        !config.METHOD_EXPORTS.includes(methodKey)
      )
        continue
      router[methodKey](url, ...handlers)
    }
    // wildcard default export route matching
    if (typeof exported.default !== "undefined") {
      router.use(url, ...getHandlers(exported.default))
    }
  }

  return router
}

const defaultOptions: IOptions = {
  directory: path.join(path.dirname(require.main.filename), "routes"),
  methodExports: []
}
