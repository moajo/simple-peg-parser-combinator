import { literal, or, sequence, repeat, repeat0, repeat1 } from "../src/index"
import { sequenceRuntime } from "../src/components/sequence"
import ParserContext from "../src/context"

test("literal", () => {
  const l = literal("hoge")
  expect(l("hoge").length).toBe("hoge".length)
  expect(l("hogea").length).toBe("hoge".length)
  expect(l("fuga")).toBe(null)
})

test("or", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const or1 = or(l1, l2)
  expect(or1("hoge").length).toBe("hoge".length)
  expect(or1("fuga").length).toBe("fuga".length)
  expect(or1("piyo")).toBe(null)
})

test("sequence", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const sequence1 = sequence(l1, l2)
  expect(sequence1("hogefuga").length).toBe(8)
  expect(sequence1("hoge")).toBe(null)
  expect(sequence1("fuga")).toBe(null)
  expect(sequence1("piyo")).toBe(null)
})

describe("repeat", () => {
  test("repeat", () => {
    const l1 = literal("ab")
    const repeat_ = repeat(l1, 3)
    expect(repeat_("ababab").length).toBe(6)
    expect(repeat_("ababababab").length).toBe(10)
    expect(repeat_("ba")).toBe(null)
  })
  test("repeat0", () => {
    const l1 = literal("ab")
    const repeat_ = repeat0(l1)
    expect(repeat_("ab").length).toBe(2)
    expect(repeat_("ababab").length).toBe(6)
    expect(repeat_("ababababab").length).toBe(10)
    expect(repeat_("").length).toBe(0)
  })
  test("repeat1", () => {
    const l1 = literal("ab")
    const repeat_ = repeat1(l1)
    expect(repeat_("ab").length).toBe(2)
    expect(repeat_("ababab").length).toBe(6)
    expect(repeat_("ababababab").length).toBe(10)
    expect(repeat_("")).toBe(null)
  })
})

test("sequenceRuntime", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const c = new ParserContext()
  c.add("hoge", l1)
  c.add("fuga", l2)
  const sequence1 = sequenceRuntime(c, null, "hoge", "fuga")
  expect(sequence1("hogefuga").length).toBe(8)
  expect(sequence1("hoge")).toBe(null)
  expect(sequence1("fuga")).toBe(null)
  expect(sequence1("piyo")).toBe(null)
})
