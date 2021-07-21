export interface IFileResult {
  name: string
  relative: string
  path: string
}

export interface IRoute {
  url: string
  exported: {
    default?: any
    get?: any
    post?: any
    put?: any
    delete?: any
    [x: string]: any
  }
}
