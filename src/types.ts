import type { Handler } from "express"

export interface Options {
  /**
   * The directory path relative to main file
   *
   * @default "/routes"
   */
  directory?: string
  /**
   * Additional methods that match an export from an route like `ws`
   *
   * ```ts
   * // app.ts
   * import ws from "express-ws"
   *
   * const { app } = ws(express())
   *
   * createRouter(app, {
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

export interface Route {
  url: string
  priority: number
  exports: {
    default?: Handler
    get?: Handler
    post?: Handler
    put?: Handler
    patch?: Handler
    delete?: Handler
    [x: string]: Handler
  }
}
