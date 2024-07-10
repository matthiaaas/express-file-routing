import path from "path"
import { walkTree, generateRoutes } from "../src/lib"
import { RoutingMethod } from "../src/types"

describe("route generation & directory traversal", () => {
  test("flat_routes", async()=>{
    const routes = await walkTreeAndGenerateRoutes("flat_routes", 'flat')

    expect(routes).toHaveLength(5)   
    expect(routes[0].url).toBe("/")
    expect(routes[1].url).toBe("/profile")
    expect(routes[2].url).toBe("/profile/messages")
    expect(routes[3].url).toBe("/profile/messages/:uuid")
    expect(routes[4].url).toBe("/profile/messages/:uuid/edit")

    expect(routes[0].priority).toBe(0)
    expect(routes[1].priority).toBe(1)
    expect(routes[2].priority).toBe(2)
    expect(routes[3].priority).toBe(4)
    expect(routes[4].priority).toBe(5)

    expect(routes[0].exports).toHaveProperty("get")     
    expect(routes[1].exports).toHaveProperty("get")     
    expect(routes[2].exports).toHaveProperty("get")     
    expect(routes[3].exports).toHaveProperty("get")     
    expect(routes[4].exports).toHaveProperty("get")     
  })
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

const walkTreeAndGenerateRoutes = async (name: string, method:RoutingMethod = 'nested') => {
  const fixture = getFixture(name)

  const files = walkTree(path.join(fixture, "routes"))

  return await generateRoutes(files, method)
}
