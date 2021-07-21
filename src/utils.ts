import fs from "fs"
import path from "path"

import config from "./config"

import type { IFileResult, IRoute } from "./types"

export const walk = (directory: string, relative: string[] = [""]) => {
  const results: IFileResult[] = []

  const files = fs.readdirSync(directory)

  for (const file of files) {
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
    if (!config.VALID_FILE_EXTENSIONS.includes(parsed.ext.toLocaleLowerCase()))
      continue

    const dir = parsed.dir === "/" ? "" : parsed.dir
    const name = parsed.name.startsWith("index.")
      ? parsed.name.replace("index", "")
      : parsed.name === "index"
      ? ""
      : "/" + parsed.name

    const url = dir + name
    const exported = require(path.join(file.path, file.name))

    routes.push({ url, exported })
  }

  return routes
}

export const getHandlers = handler => {
  if (!Array.isArray(handler)) return [handler]

  return handler
}
