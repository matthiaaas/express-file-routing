import { Router } from "express"

import type { Options } from "./types"

import createRouter from "./router"

export default createRouter

export const router = (options: Options = {}) => {
  return createRouter(Router(), options)
}
