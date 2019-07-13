import { literal, or, repeat1, repeat0, sequence, ref } from "../src/index"
import { ParserResolver, ParseContext, ParserCache } from "../src/context"
import { Parser } from "../src/types"

describe("expression", () => {
  const digits = repeat1(
    or(
      ...[...Array(10).keys()].map(i =>
        literal(`${i}`).map(s => parseInt(s, 10))
      )
    )
  ).map(arr => arr.reduce((prev, current) => prev * 10 + current))
  let c = new ParserResolver()
  c.add("+", literal("+"))
  c.add("-", literal("-"))
  c.add("*", literal("*"))
  c.add("/", literal("/"))
  c.add("(", literal("("))
  c.add(")", literal(")"))
  const bracedExpression = sequence(
    ref("("),
    ref("expression") as Parser<number>,
    ref(")")
  ).map(([_, exp, __]) => exp)
  const factor = or(bracedExpression, digits)

  c.add("*/", or(ref("*"), ref("/")))
  c.add("+-", or(ref("+"), ref("-")))

  const term = sequence(
    factor,
    repeat0(
      sequence(ref("*/"), factor).map(([op, num]) =>
        op == "*" ? (a: number) => a * num : (a: number) => a / num
      )
    )
  ).map(([num, ops]) => ops.reduce((value, op) => op(value), num))

  const exprTail = repeat0(
    sequence(ref("+-"), term).map(vs =>
      vs[0] == "+" ? (a: number) => a + vs[1] : (a: number) => a - vs[1]
    )
  )
  c.add(
    "expression",
    sequence(term, exprTail).map(([num, ops]) =>
      ops.reduce((value, op) => op(value), num)
    )
  )

  test("digits", () => {
    const pc = new ParseContext(new ParserCache(), c)
    expect(digits.parse(pc, "1")!.value).toBe(1)
    expect(digits.parse(pc, "0")!.value).toBe(0)
    expect(digits.parse(pc, "9")!.value).toBe(9)
    expect(digits.parse(pc, "123")!.value).toBe(123)
    expect(digits.parse(pc, "99999999999999")!.value).toBe(99999999999999)
    expect(digits.parse(pc, "aaa")).toBe(null)
  })

  test("factor", () => {
    const pc = new ParseContext(new ParserCache(), c)
    expect(factor.parse(pc, "1")!.value).toBe(1)
    expect(factor.parse(pc, "(1)")!.value).toBe(1)
    expect(factor.parse(pc, "((1))")!.value).toBe(1)
    expect(factor.parse(pc, "(1+2)")!.value).toBe(1 + 2)
    expect(factor.parse(pc, "((1)")).toBe(null)
    expect(factor.parse(pc, "1a")!.value).toBe(1)
    expect(factor.parse(pc, "1a")!.length).toBe(1)
  })

  test("term", () => {
    const pc = new ParseContext(new ParserCache(), c)
    expect(term.parse(pc, "1*1")!.value).toBe(1 * 1)
    expect(term.parse(pc, "3*4/5*(2+4)")!.value).toBe(((3 * 4) / 5) * (2 + 4))
    expect(term.parse(pc, "3*4/5*(2+4")!.value).toBe((3 * 4) / 5)
  })

  test("expression", () => {
    const expression = c.get("expression")
    const pc = new ParseContext(new ParserCache(), c)
    expect(expression.parse(pc, "1*1+4")!.value).toBe(1 * 1 + 4)
    expect(expression.parse(pc, "3*4/5*(2+4)+5*(3+7)")!.value).toBe(
      ((3 * 4) / 5) * (2 + 4) + 5 * (3 + 7)
    )
    expect(expression.parse(pc, "3*4/5*6*(2+4")!.value).toBe(((3 * 4) / 5) * 6)
  })
})
