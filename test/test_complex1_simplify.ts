import { or, repeat1, repeat0, sequence, ref, regex } from "../src/index"
import { ParserResolver, ParseContext, ParserCache } from "../src/context"
import { Parser } from "../src/types"

describe("expression", () => {
  const digits = repeat1(regex(/[0-9]/).map(s => parseInt(s, 10))).map(arr =>
    arr.reduce((prev, current) => prev * 10 + current)
  )
  const bracedExpression = sequence(
    "(",
    ref("expression") as Parser<number>,
    ")"
  ).map(([_, exp, __]) => exp)
  const factor = or(bracedExpression, digits)

  const mul_div = or("*", "/")
  const plus_minus = or("+", "-")

  const term = sequence(
    factor,
    repeat0(
      sequence(mul_div, factor).map(([op, num]) => (a: number) =>
        op == "*" ? a * num : a / num
      )
    )
  ).map(([num, ops]) => ops.reduce((value, op) => op(value), num))

  const exprTail = repeat0(
    sequence(plus_minus, term).map(([op, num]) => (a: number) =>
      op == "+" ? a + num : a - num
    )
  )
  const c = new ParserResolver()
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
