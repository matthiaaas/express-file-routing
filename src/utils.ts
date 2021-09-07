import fs from "fs"
import path from "path"

import config from "./config"

import type { IFileResult, IRoute } from "./types"

export const log = (a: string, b: string, c: number) => {
  console.log(`%s \r\t %s \r\t\t\t\t\t${c}`, a, b)
}

const regBackets = /\[([^}]*)\]/g
export const setBrackets = (x: string) =>
  regBackets.test(x) ? x.replace(regBackets, (_, s) => `:${s}`) : x

export const walk = (directory: string, relative: string[] = [""]) => {
  const results: IFileResult[] = []

  for (const file of fs.readdirSync(directory)) {
    const filePath = path.join(directory, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...walk(filePath, [...relative, file]))
    } else {
      results.push({
        name: file,
        path: directory,
        relative: `${relative.join("/")}/${file}`
      })
    }
  }

  return results
}

export const generateRoutes = (files: IFileResult[]) => {
  const routes: IRoute[] = []

  for (const file of files) {
    const parsed = path.parse(file.relative)
    if (
      !config.VALID_FILE_EXTENSIONS.includes(parsed.ext.toLocaleLowerCase()) ||
      parsed.name.startsWith("_") ||
      parsed.dir.startsWith("/_")
    )
      continue

    const dir = parsed.dir === "/" ? "" : parsed.dir
    const name = parsed.name.startsWith("index.")
      ? parsed.name.replace("index", "")
      : parsed.name === "index"
      ? "/"
      : "/" + parsed.name

    const url = setBrackets(dir) + setBrackets(name)
    const exported = require(path.join(file.path, file.name))

    routes.push({
      url,
      exported: { ...exported, priority: exported.priority || 0 }
    })
  }

  return routes.sort((p, n) => n.exported.priority - p.exported.priority)
}

export const getHandlers = handler => {
  if (!Array.isArray(handler)) return [handler]

  return handler
}

export const getMethodKey = (method: string) => {
  let methodKey = method.toLowerCase()

  if (methodKey === "del") return "delete"

  return methodKey
}
