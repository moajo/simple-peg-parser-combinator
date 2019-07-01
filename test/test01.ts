import { literal, or, sequence, repeat, repeat0, repeat1 } from "../src/index"
import { sequenceRuntime } from "../src/components/sequence"
import ParserResolver from "../src/context"

test("literal", () => {
  console.log("@", literal("hoge"))
  const l = literal("hoge")
  expect(l.parse("hoge")!.length).toBe("hoge".length)
  expect(l.parse("hogea")!.length).toBe("hoge".length)
  expect(l.parse("fuga")).toBe(null)
})

test("or", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const or1 = or(l1, l2)
  expect(or1.parse("hoge")!.length).toBe("hoge".length)
  expect(or1.parse("fuga")!.length).toBe("fuga".length)
  expect(or1.parse("piyo")).toBe(null)
})

test("sequence", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const sequence1 = sequence(l1, l2)
  expect(sequence1.parse("hogefuga")!.length).toBe(8)
  expect(sequence1.parse("hoge")).toBe(null)
  expect(sequence1.parse("fuga")).toBe(null)
  expect(sequence1.parse("piyo")).toBe(null)
})

describe("repeat", () => {
  test("repeat", () => {
    const l1 = literal("ab")
    const repeat_ = repeat(l1, 3)
    expect(repeat_.parse("ababab")!.length).toBe(6)
    expect(repeat_.parse("ababababab")!.length).toBe(10)
    expect(repeat_.parse("ba")).toBe(null)
  })
  test("repeat0", () => {
    const l1 = literal("ab")
    const repeat_ = repeat0(l1)
    expect(repeat_.parse("ab")!.length).toBe(2)
    expect(repeat_.parse("ababab")!.length).toBe(6)
    expect(repeat_.parse("ababababab")!.length).toBe(10)
    expect(repeat_.parse("")!.length).toBe(0)
  })
  test("repeat1", () => {
    const l1 = literal("ab")
    const repeat_ = repeat1(l1)
    expect(repeat_.parse("ab")!.length).toBe(2)
    expect(repeat_.parse("ababab")!.length).toBe(6)
    expect(repeat_.parse("ababababab")!.length).toBe(10)
    expect(repeat_.parse("")).toBe(null)
  })
})

test("sequenceRuntime", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const c = new ParserResolver()
  c.add("hoge", l1)
  c.add("fuga", l2)
  const sequence1 = sequenceRuntime(c, "hoge", "fuga")
  expect(sequence1.parse("hogefuga")!.length).toBe(8)
  expect(sequence1.parse("hoge")).toBe(null)
  expect(sequence1.parse("fuga")).toBe(null)
  expect(sequence1.parse("piyo")).toBe(null)
})
