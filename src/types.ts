import { NextFunction, Request, Response } from "express";

export interface IFileResult {
  name: string
  relative: string
  path: string
}

export type Handler<Params = any, Body = any, Qs = any> = (req?: Request<Params, {}, Body, Qs>, res?: Response, next?: NextFunction) => void;

export interface IRoute {
  url: string
  exported: {
    priority?: number;
    default?: Handler
    get?: Handler
    post?: Handler
    put?: Handler
    delete?: Handler
    [x: string]: any
  }
}
export interface IOptions {
  directory?: string
  base?: string
  methodExports?: string[]
  verbose?: boolean
}