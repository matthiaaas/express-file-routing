import path from "path"
import { Router } from "express"

import { walk, generateRoutes } from "./utils"

interface IOptions {
  directory?: string
  resolver?: (route: string, cb: any) => {} // @TODO custom route resolver
}

export default (opts: IOptions = defaultOptions): Router => {
  const options = { ...defaultOptions, ...opts }

  const router = Router({ mergeParams: true })

  const files = walk(options.directory)
  const routes = generateRoutes(files)

  for (const { url, exported } of routes) {
    const exportedMethods = Object.entries(exported)
    for (const [method, handler] of exportedMethods) {
      switch (method) {
        case "get":
          router.get(url, handler)
          break
        case "post":
          router.post(url, handler)
          break
        case "put":
          router.put(url, handler)
          break
        case "delete":
          router.delete(url, handler)
          break
        default:
          break
      }
    }
    // wildcard default export route matching
    if (typeof exported.default !== "undefined") {
      router.use(url, exported.default)
    }
  }

  return router
}

const defaultOptions: IOptions = {
  directory: path.join(__dirname, "routes")
}
