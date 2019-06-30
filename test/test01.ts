import { literal, or } from "../src/index"

test("literal", () => {
  const l = literal("hoge")
  expect(l("hoge")).toBe("hoge".length)
  expect(l("hogea")).toBe("hoge".length)
  expect(l("fuga")).toBe(null)
})

test("or", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const or1 = or(l1, l2)
  expect(or1("hoge")).toBe("hoge".length)
  expect(or1("fuga")).toBe("fuga".length)
  expect(or1("piyo")).toBe(null)
})
