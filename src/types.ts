import type { Handler } from "express"

import { verboseTypes } from "./options"

export interface IFile {
  name: string
  path: string
  rel: string
}

export interface IRoute {
  url: string
  priority: number
  exported: {
    default?: Handler
    get?: Handler
    post?: Handler
    put?: Handler
    patch?: Handler
    delete?: Handler
    [x: string]: any
  }
}

type TVerboseType = keyof typeof verboseTypes

export interface IOptions {
  directory?: string
  base?: string
  methodExports?: string[]
  verbose?: boolean | TVerboseType
}
