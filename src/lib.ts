import { readdirSync, statSync } from "fs"
import path from "path"

import type { File, Route } from "./types"

import {
  buildRouteUrl,
  calculatePriority,
  isFileIgnored,
  mergePaths,
  prioritizeRoutes
} from "./utils"

/**
 * @param directory The directory path to walk recursively
 * @param tree
 *
 * @returns An array of all nested files in the specified directory
 */
export const walkTree = (directory: string, tree: string[] = []) => {
  const results: File[] = []

  for (const fileName of readdirSync(directory)) {
    const filePath = path.join(directory, fileName)
    const fileStats = statSync(filePath)

    if (fileStats.isDirectory()) {
      results.push(...walkTree(filePath, [...tree, fileName]))
    } else {
      results.push({
        name: fileName,
        path: directory,
        rel: mergePaths(...tree, fileName)
      })
    }
  }

  return results
}

/**
 * @param files
 *
 * @returns
 */
export const generateRoutes = async (files: File[]) => {
  const routes: Route[] = []

  for (const file of files) {
    const parsedFile = path.parse(file.rel)

    if (isFileIgnored(parsedFile)) continue

    const directory = parsedFile.dir === parsedFile.root ? "" : parsedFile.dir
    const name = parsedFile.name.startsWith("index")
      ? parsedFile.name.replace("index", "")
      : `/${parsedFile.name}`

    const url = buildRouteUrl(directory + name)
    const priority = calculatePriority(url)
    const exports = await import(path.join(file.path, file.name))

    routes.push({
      url,
      priority,
      exports
    })
  }

  return prioritizeRoutes(routes)
}
