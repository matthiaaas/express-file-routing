import path from "path"

import config from "./config"

import { walk, generateRoutes, getHandlers } from "./utils"

interface IOptions {
  directory?: string
  methodExports?: string[]
}

export default <T>(app: T, opts: IOptions = defaultOptions): T => {
  const options = { ...defaultOptions, ...opts }

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
      app[methodKey](url, ...handlers)
    }
    // wildcard default export route matching
    if (typeof exported.default !== "undefined") {
      // @ts-ignore
      app.use(url, ...getHandlers(exported.default))
    }
  }

  return app
}

const defaultOptions: IOptions = {
  directory: path.join(path.dirname(require.main.filename), "routes"),
  methodExports: []
}
