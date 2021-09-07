import fs from "fs"
import path from "path"

import config from "./config"

import type { IFile, IRoute } from "./types"

export const log = (a: string, b: string, c: number) => {
  console.log(`%s \r\t %s \r\t\t\t\t\t${c}`, a, b)
}

const regBackets = /\[([^}]*)\]/g
export const setBrackets = (x: string) =>
  regBackets.test(x) ? x.replace(regBackets, (_, s) => `:${s}`) : x

export const walk = (directory: string, relative: string[] = [""]) => {
  const results: IFile[] = []

  for (const file of fs.readdirSync(directory)) {
    const filePath = path.join(directory, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...walk(filePath, [...relative, file]))
    } else {
      results.push({
        name: file,
        path: directory,
        rel: `${relative.join("/")}/${file}`
      })
    }
  }

  return results
}

export const generateRoutes = (files: IFile[]) => {
  const routes: IRoute[] = []

  for (const file of files) {
    const parsed = path.parse(file.rel)
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
    const priority = calcPriority(url)

    routes.push({
      url,
      priority,
      exported
    })
  }

  return routes.sort((a, b) => a.priority - b.priority)
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

const calcPriority = (url: string) => {
  const depth = url.match(/\/.+?/g)?.length || 0
  const specifity = url.match(/\/:.+?/g)?.length || 0

  return depth + specifity
}
