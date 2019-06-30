import { literal, or, sequence, repeat, repeat0, repeat1 } from "../src/index"

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

test("sequence", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const sequence1 = sequence(l1, l2)
  expect(sequence1("hogefuga")).toBe(8)
  expect(sequence1("hoge")).toBe(null)
  expect(sequence1("fuga")).toBe(null)
  expect(sequence1("piyo")).toBe(null)
})

describe("repeat", () => {
  test("repeat", () => {
    const l1 = literal("ab")
    const repeat_ = repeat(l1, 3)
    expect(repeat_("ababab")).toBe(6)
    expect(repeat_("ababababab")).toBe(10)
    expect(repeat_("ba")).toBe(null)
  })
  test("repeat0", () => {
    const l1 = literal("ab")
    const repeat_ = repeat0(l1)
    expect(repeat_("ab")).toBe(2)
    expect(repeat_("ababab")).toBe(6)
    expect(repeat_("ababababab")).toBe(10)
    expect(repeat_("")).toBe(0)
  })
  test("repeat1", () => {
    const l1 = literal("ab")
    const repeat_ = repeat1(l1)
    expect(repeat_("ab")).toBe(2)
    expect(repeat_("ababab")).toBe(6)
    expect(repeat_("ababababab")).toBe(10)
    expect(repeat_("")).toBe(null)
  })
})
