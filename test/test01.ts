import {
  literal,
  or,
  sequence,
  repeat,
  repeat0,
  repeat1,
  anyChar,
  andPredicate,
  notPredicate,
  EOF,
  between,
  regex
} from "../src/index"
import { ParserResolver, ParseContext, ParserCache } from "../src/context"

test("literal", () => {
  const l = literal("hoge")
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(l.parse(pc, "hoge")!.length).toBe("hoge".length)
  expect(l.parse(pc, "hogea")!.length).toBe("hoge".length)
  expect(l.parse(pc, "fuga")).toBe(null)
})

test("or", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const or1 = or(l1, l2)
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(or1.parse(pc, "hoge")!.length).toBe("hoge".length)
  expect(or1.parse(pc, "fuga")!.length).toBe("fuga".length)
  expect(or1.parse(pc, "piyo")).toBe(null)
})

test("sequence", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const sequence1 = sequence(l1, l2)
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(sequence1.parse(pc, "hogefuga")!.length).toBe(8)
  expect(sequence1.parse(pc, "hoge")).toBe(null)
  expect(sequence1.parse(pc, "fuga")).toBe(null)
  expect(sequence1.parse(pc, "piyo")).toBe(null)
})

describe("repeat", () => {
  test("repeat", () => {
    const l1 = literal("ab")
    const repeat_ = repeat(l1, 3)
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(repeat_.parse(pc, "ababab")!.length).toBe(6)
    expect(repeat_.parse(pc, "ababababab")!.length).toBe(10)
    expect(repeat_.parse(pc, "ba")).toBe(null)
  })
  test("repeat0", () => {
    const l1 = literal("ab")
    const repeat_ = repeat0(l1)
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(repeat_.parse(pc, "ab")!.length).toBe(2)
    expect(repeat_.parse(pc, "ababab")!.length).toBe(6)
    expect(repeat_.parse(pc, "ababababab")!.length).toBe(10)
    expect(repeat_.parse(pc, "")!.length).toBe(0)
  })
  test("repeat1", () => {
    const l1 = literal("ab")
    const repeat_ = repeat1(l1)
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(repeat_.parse(pc, "ab")!.length).toBe(2)
    expect(repeat_.parse(pc, "ababab")!.length).toBe(6)
    expect(repeat_.parse(pc, "ababababab")!.length).toBe(10)
    expect(repeat_.parse(pc, "")).toBe(null)
  })
})

test("any", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(anyChar.parse(pc, "ab")!.length).toBe(1)
  expect(anyChar.parse(pc, ".")!.length).toBe(1)
  expect(anyChar.parse(pc, "6")!.length).toBe(1)
  expect(anyChar.parse(pc, "")).toBe(null)
})

describe("predicate", () => {
  test("andPredicate", () => {
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    const p = andPredicate(literal("a"))
    expect(p.parse(pc, "ab")!.length).toBe(0)
    expect(p.parse(pc, "ba")).toBe(null)
  })
  test("notPredicate", () => {
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    const p = notPredicate(literal("a"))
    expect(p.parse(pc, "ba")!.length).toBe(0)
    expect(p.parse(pc, "ab")).toBe(null)
  })
})

test("EOF", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  const p = EOF
  expect(p.parse(pc, "")!.length).toBe(0)
  expect(p.parse(pc, "a")).toBe(null)
})

test("between", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  const p = between("a", "z")
  expect(p.parse(pc, "a")!.length).toBe(1)
  expect(p.parse(pc, "b")!.length).toBe(1)
  expect(p.parse(pc, "f")!.length).toBe(1)
  expect(p.parse(pc, "z")!.length).toBe(1)
  expect(p.parse(pc, String.fromCharCode("a".codePointAt(0)! - 1))).toBe(null)
  expect(p.parse(pc, String.fromCharCode("z".codePointAt(0)! + 1))).toBe(null)
})

test("regex", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  const p = regex(/[4-8]+/)
  expect(p.parse(pc, "a")).toBe(null)
  expect(p.parse(pc, "f67")).toBe(null)
  expect(p.parse(pc, "34567")).toBe(null)
  expect(p.parse(pc, "45678abc")!.value).toBe("45678")
})
