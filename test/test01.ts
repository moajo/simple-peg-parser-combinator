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
  expect(l.parse(pc, "hoge", 0)!.value).toBe("hoge")
  expect(l.parse(pc, "hogea", 0)!.value).toBe("hoge")
  expect(l.parse(pc, "fuga", 0)).toBe(null)
})

test("or", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const or1 = or(l1, l2)
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(or1.parse(pc, "hoge", 0)!.value).toBe("hoge")
  expect(or1.parse(pc, "fuga", 0)!.value).toBe("fuga")
  expect(or1.parse(pc, "piyo", 0)).toBe(null)
})

test("sequence", () => {
  const l1 = literal("hoge")
  const l2 = literal("fuga")
  const sequence1 = sequence(l1, l2)
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(sequence1.parse(pc, "hogefuga", 0)!.value).toStrictEqual([
    "hoge",
    "fuga"
  ])
  expect(sequence1.parse(pc, "hoge", 0)).toBe(null)
  expect(sequence1.parse(pc, "fuga", 0)).toBe(null)
  expect(sequence1.parse(pc, "piyo", 0)).toBe(null)
})

describe("repeat", () => {
  test("repeat", () => {
    const l1 = literal("ab")
    const repeat_ = repeat(l1, 3)
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(repeat_.parse(pc, "ababab", 0)!.value).toStrictEqual([
      "ab",
      "ab",
      "ab"
    ])
    expect(repeat_.parse(pc, "ababababab", 0)!.length).toBe(10)
    expect(repeat_.parse(pc, "ba", 0)).toBe(null)
  })
  test("repeat0", () => {
    const l1 = literal("ab")
    const repeat_ = repeat0(l1)
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(repeat_.parse(pc, "ab", 0)!.length).toBe(2)
    expect(repeat_.parse(pc, "ababab", 0)!.length).toBe(6)
    expect(repeat_.parse(pc, "ababababab", 0)!.length).toBe(10)
    expect(repeat_.parse(pc, "", 0)!.length).toBe(0)
  })
  test("repeat1", () => {
    const l1 = literal("ab")
    const repeat_ = repeat1(l1)
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(repeat_.parse(pc, "ab", 0)!.length).toBe(2)
    expect(repeat_.parse(pc, "ababab", 0)!.length).toBe(6)
    expect(repeat_.parse(pc, "ababababab", 0)!.length).toBe(10)
    expect(repeat_.parse(pc, "", 0)).toBe(null)
  })
})

test("any", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(anyChar.parse(pc, "ab", 0)!.value).toBe("a")
  expect(anyChar.parse(pc, "b", 0)!.value).toBe("b")
  expect(anyChar.parse(pc, ".", 0)!.length).toBe(1)
  expect(anyChar.parse(pc, "6", 0)!.length).toBe(1)
  expect(anyChar.parse(pc, "", 0)).toBe(null)
})

describe("predicate", () => {
  test("andPredicate", () => {
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    const p = andPredicate(literal("a"))
    expect(p.parse(pc, "ab", 0)!.length).toBe(0)
    expect(p.parse(pc, "ba", 0)).toBe(null)
  })
  test("notPredicate", () => {
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    const p = notPredicate(literal("a"))
    expect(p.parse(pc, "ba", 0)!.length).toBe(0)
    expect(p.parse(pc, "ab", 0)).toBe(null)
  })
})

test("EOF", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  const p = EOF
  expect(p.parse(pc, "", 0)!.length).toBe(0)
  expect(p.parse(pc, "a", 0)).toBe(null)
})

test("between", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  const p = between("a", "z")
  expect(p.parse(pc, "a", 0)!.length).toBe(1)
  expect(p.parse(pc, "b", 0)!.length).toBe(1)
  expect(p.parse(pc, "f", 0)!.length).toBe(1)
  expect(p.parse(pc, "z", 0)!.length).toBe(1)
  expect(p.parse(pc, String.fromCharCode("a".codePointAt(0)! - 1), 0)).toBe(
    null
  )
  expect(p.parse(pc, String.fromCharCode("z".codePointAt(0)! + 1), 0)).toBe(
    null
  )
})

test("regex", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  const p = regex(/[4-8]+/)
  expect(p.parse(pc, "a", 0)).toBe(null)
  expect(p.parse(pc, "f67", 0)).toBe(null)
  expect(p.parse(pc, "34567", 0)).toBe(null)
  expect(p.parse(pc, "45678abc", 0)!.value).toBe("45678")
  expect(p.parse(pc, "45678abc", 1)!.value).toBe("5678")
})
