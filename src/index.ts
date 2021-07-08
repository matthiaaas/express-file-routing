import path from "path"
import { Router } from "express"

import { walk, generateRoutes } from "./utils"

interface IOptions {
  directory?: string
  resolver?: (route: string, cb: any) => {} // @TODO custom route resolver
}

export default (opts: IOptions = defaultOptions): Router => {
  const router = Router({ mergeParams: true })

  const files = walk(opts.directory)

  const routes = generateRoutes(files)

  for (const route of routes) {
    router.use(route.url, route.cb.default)
  }

  return router
}

const defaultOptions: IOptions = {
  directory: path.join(__dirname, "routes")
}
