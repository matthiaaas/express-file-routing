import { buildRouteUrl, mergePaths } from "../src/utils"

describe("buildRouteUrl", () => {
  test("index route", () => {
    expect(buildRouteUrl("/")).toBe("/")
  })

  test("explicit route", () => {
    expect(buildRouteUrl("/posts")).toBe("/posts")
  })

  test("nested explicit route", () => {
    expect(buildRouteUrl("/auth/signin")).toBe("/auth/signin")
  })

  test("dynamic parameter", () => {
    expect(buildRouteUrl("/[user]")).toBe("/:user")
  })

  test("nested dynamic parameter", () => {
    expect(buildRouteUrl("/posts/[id]")).toBe("/posts/:id")
  })

  test("nested dynamic parameter with explicit subroute", () => {
    expect(buildRouteUrl("/posts/[id]/comments")).toBe("/posts/:id/comments")
  })

  test("double nested dynamic parameter", () => {
    expect(buildRouteUrl("/posts/[id]/comments/[id]")).toBe(
      "/posts/:id/comments/:id"
    )
  })

  test("catchall route", () => {
    expect(buildRouteUrl("/[...catchall]")).toBe("/*")
  })

  test("nested catchall route", () => {
    expect(buildRouteUrl("/users/[...catchall]")).toBe("/users/*")
  })
})

describe("mergePaths", () => {
  test("index", () => {
    expect(mergePaths("/", "index.ts")).toBe("/index.ts")
  })

  test("index with nested explicit route", () => {
    expect(mergePaths("/", "users.ts")).toBe("/users.ts")
  })

  test("nested dynamic parameter index", () => {
    expect(mergePaths("/posts/[id]", "index.ts")).toBe("/posts/[id]/index.ts")
  })

  test("multiple path fragments", () => {
    expect(mergePaths("/auth", "/signin", "token.ts")).toBe(
      "/auth/signin/token.ts"
    )
  })

  test("multiple path fragments with dynamic parameters", () => {
    expect(
      mergePaths("/posts", "/[userId]", "/comments", "[commentId].ts")
    ).toBe("/posts/[userId]/comments/[commentId].ts")
  })

  test("multiple malformed path fragments", () => {
    expect(mergePaths("/", "/auth", "//", "signin.ts")).toBe("/auth/signin.ts")
  })
})
