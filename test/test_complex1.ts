import { literal, or, repeat1, repeat0, sequence } from "../src/index"
import ParserResolver, { ParseContext, ParserCache } from "../src/context"

describe("expression", () => {
  const digits = repeat1(
    or(
      ...[...Array(10).keys()].map(i =>
        literal(`${i}`).map(s => parseInt(s, 10))
      )
    )
  ).map(arr => (arr as number[]).reduce((prev, current) => prev * 10 + current))
  let c = new ParserResolver()
  c.add("+", literal("+"))
  c.add("-", literal("-"))
  c.add("*", literal("*"))
  c.add("/", literal("/"))
  c.add("(", literal("("))
  c.add(")", literal(")"))
  c.add("bracedExpression", sequence("(", "expression", ")").map(vs => vs[1]))
  c.add("factor", or("bracedExpression", digits))

  c.add("*/", or("*", "/"))
  c.add("+-", or("+", "-"))
  c.add(
    "term",
    sequence(
      "factor",
      repeat0(
        sequence("*/", "factor").map(vs => {
          return vs[0] == "*"
            ? (a: number) => a * vs[1]
            : (a: number) => a / vs[1]
        })
      )
    ).map(vs => {
      let r = vs[0]
      for (let i = 0; i < vs[1].length; i++) {
        r = vs[1][i](r)
      }
      return r
    })
  )

  c.add(
    "exprTail1",
    sequence("+-", "term").map(vs =>
      vs[0] == "+" ? (a: number) => a + vs[1] : (a: number) => a - vs[1]
    )
  )
  c.add("exprTail", repeat0("exprTail1"))
  c.add(
    "expression",
    sequence("term", "exprTail").map(vs => {
      let r = vs[0]
      for (let i = 0; i < vs[1].length; i++) {
        r = vs[1][i](r)
      }
      return r
    })
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
    const factor = c.get("factor")
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
    const term = c.get("term")
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
