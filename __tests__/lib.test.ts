import path from "path"
import { walkTree, generateRoutes } from "../src/lib"

describe("route generation & directory traversal", () => {
  test("index route", async () => {
    const routes = await walkTreeAndGenerateRoutes("index_route")

    expect(routes).toHaveLength(1)
    expect(routes[0].url).toBe("/")
    expect(routes[0].priority).toBe(0)
    expect(routes[0].exports).toHaveProperty("get")
  })

  test("nested index route", async () => {
    const routes = await walkTreeAndGenerateRoutes("nested_index_route")

    expect(routes).toHaveLength(1)
    expect(routes[0].url).toBe("/users")
    expect(routes[0].exports).toHaveProperty("get")
  })

  test("multi nested routes", async () => {
    const routes = await walkTreeAndGenerateRoutes("multi_nested_routes")

    expect(routes).toHaveLength(4)
    expect(routes[0].url).toBe("/")
    expect(routes[1].url).toBe("/announcements")
    expect(routes[2].url).toBe("/users")
    expect(routes[3].url).toBe("/users/admins/all")
  })

  test("complex routes", async () => {
    const routes = await walkTreeAndGenerateRoutes("complex_routes")

    expect(routes).toHaveLength(6)
    expect(routes[0].url).toBe("/")
    expect(routes[1].url).toBe("/announcements")
    expect(routes[2].url).toBe("/posts")
    expect(routes[3].url).toBe("/posts/:slug")
    expect(routes[4].url).toBe("/posts/:slug/comments")
    expect(routes[5].url).toBe("/posts/:slug/comments/:id/reactions")
  })

  test("catchall route", async () => {
    const routes = await walkTreeAndGenerateRoutes("catchall_route")

    expect(routes).toHaveLength(2)
    expect(routes[0].url).toBe("/dashboard")
    expect(routes[1].url).toBe("/*")
  })
})

const getFixture = (name: string) => path.join(__dirname, "fixtures", name)

const walkTreeAndGenerateRoutes = async (name: string) => {
  const fixture = getFixture(name)

  const files = walkTree(path.join(fixture, "routes"))

  return await generateRoutes(files)
}
