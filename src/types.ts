import type { Express, Router, Handler } from "express"

export type ExpressLike = Express | Router

export interface Options {
  /**
   * The routes entry directory (optional)
   *
   * ```ts
   * await createRouter(app, {
   *  directory: path.join(__dirname, "pages")
   * })
   * ```
   */
  directory?: string
  /**
   * Additional methods that match an export from a route like `ws`
   *
   * ```ts
   * // app.ts
   * import ws from "express-ws"
   *
   * const { app } = ws(express())
   *
   * await createRouter(app, {
   *  // without this the exported ws handler is ignored
   *  additionalMethods: ["ws"]
   * })
   *
   * // /routes/room.ts
   * export const ws = (ws, req) => {
   *  ws.send("hello")
   * }
   * ```
   */
  additionalMethods?: string[]
}

export interface File {
  name: string
  path: string
  rel: string
}

type MethodExport = Handler | Handler[]

interface MethodExports {
  get?: MethodExport
  post?: MethodExport
  put?: MethodExport
  patch?: MethodExport
  delete?: MethodExport
  head?: MethodExport
  connect?: MethodExport
  options?: MethodExport
  trace?: MethodExport

  [x: string]: MethodExport | undefined
}

type Exports = MethodExports & {
  default?: any
}

export interface Route {
  url: string
  priority: number
  exports: Exports
}
