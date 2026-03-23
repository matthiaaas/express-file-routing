/**
 * @type {import("ts-jest").JestConfigWithTsJest}
 */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/fixtures/"]
}
