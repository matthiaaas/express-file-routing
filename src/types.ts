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

interface MethodExports {
  get?: Handler
  post?: Handler
  put?: Handler
  patch?: Handler
  delete?: Handler
  head?: Handler
  connect?: Handler
  options?: Handler
  trace?: Handler

  [x: string]: Handler
}

type Exports = MethodExports & {
  default?: any
}

export interface Route {
  url: string
  priority: number
  exports: Exports
}
