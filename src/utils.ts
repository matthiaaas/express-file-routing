import fs from "fs"
import path from "path"

import config from "./config"
import type { IFileResult, IRoute } from "./types"

export const walk = (directory: string, relative: string[] = []) => {
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
        relative: `${relative.length > 0 ? "/" : ""}${relative.join(
          "/"
        )}/${file}`
      })
    }
  }

  return results
}

export const generateRoutes = (files: IFileResult[]) => {
  const routes: IRoute[] = []

  for (const file of files) {
    const extension = path.extname(file.name)
    if (!config.VALID_FILE_EXTENSIONS.includes(extension)) continue

    let url = removeExtension(file.relative)
    if (path.parse(file.name).name === "index") {
      url = url.replace(new RegExp("index$"), "")
    }

    routes.push({
      url: url,
      exported: require(path.join(file.path, file.name))
    })
  }

  return routes
}

const removeExtension = (fileName: string) =>
  fileName.replace(new RegExp(path.extname(fileName) + "$"), "")

export const getHandlers = handler => {
  if (!Array.isArray(handler)) return [handler]

  return handler
}
