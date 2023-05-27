import { readdirSync, statSync } from "fs"
import path from "path"

import type { File, Route } from "./types"

import {
  buildRoutePath,
  buildRouteUrl,
  calculatePriority,
  isFileIgnored,
  mergePaths,
  prioritizeRoutes
} from "./utils"

/**
 * Recursively walk a directory and return all nested files.
 *
 * @param directory The directory path to walk recursively
 * @param tree The tree of directories leading to the current directory
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
 * Generate routes from an array of files by loading them as modules.
 *
 * @param files An array of files to generate routes from
 *
 * @returns An array of routes
 */
export const generateRoutes = async (files: File[]) => {
  const routes: Route[] = []

  for (const file of files) {
    const parsedFile = path.parse(file.rel)

    if (isFileIgnored(parsedFile)) continue

    const routePath = buildRoutePath(parsedFile)
    const url = buildRouteUrl(routePath)
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
