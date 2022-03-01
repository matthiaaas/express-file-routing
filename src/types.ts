import type { Handler } from "express"

export interface Options {
  directory?: string
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
