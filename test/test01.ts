import { literal } from "../src/index"

test("literal", () => {
  const l = literal("hoge")
  expect(l("hoge")).toBe("hoge".length)
  expect(l("hogea")).toBe("hoge".length)
  expect(l("fuga")).toBe(null)
})
