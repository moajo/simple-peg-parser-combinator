import { literal, or, repeat1 } from "../src/index"
import ParserContext from "../src/context"
import { sequenceRuntime } from "../src/components/sequence"
import { orRuntime } from "../src/components/or"
import { repeat0Runtime } from "../src/components/repeat"

describe("expression", () => {
  const digits = repeat1(
    or(
      ...[...Array(10).keys()].map(i =>
        literal(`${i}`).map(s => parseInt(s, 10))
      )
    )
  ).map(arr => (arr as number[]).reduce((prev, current) => prev * 10 + current))
  let c = new ParserContext()
  c.add("+", literal("+"))
  c.add("-", literal("-"))
  c.add("*", literal("*"))
  c.add("/", literal("/"))
  c.add("(", literal("("))
  c.add(")", literal(")"))
  c.add("digits", digits)
  c.add(
    "bracedExpression",
    sequenceRuntime(c, "(", "expression", ")").map(vs => vs[1])
  )
  c.add("factor", orRuntime(c, "bracedExpression", "digits"))

  c.add("*/", orRuntime(c, "*", "/"))
  c.add("+-", orRuntime(c, "+", "-"))
  c.add(
    "termTail1",
    sequenceRuntime(c, "*/", "factor").map(vs => {
      return vs[0] == "*" ? (a: number) => a * vs[1] : (a: number) => a / vs[1]
    })
  )
  c.add("termTail", repeat0Runtime(c, "termTail1"))
  c.add(
    "term",
    sequenceRuntime(c, "factor", "termTail").map(vs => {
      let r = vs[0]
      for (let i = 0; i < vs[1].length; i++) {
        r = vs[1][i](r)
      }
      return r
    })
  )

  c.add(
    "exprTail1",
    sequenceRuntime(c, "+-", "term").map(vs =>
      vs[0] == "+" ? (a: number) => a + vs[1] : (a: number) => a - vs[1]
    )
  )
  c.add("exprTail", repeat0Runtime(c, "exprTail1"))
  c.add(
    "expression",
    sequenceRuntime(c, "term", "exprTail").map(vs => {
      let r = vs[0]
      for (let i = 0; i < vs[1].length; i++) {
        r = vs[1][i](r)
      }
      return r
    })
  )

  test("digits", () => {
    let digits_ = digits
    expect(digits_.parse("1")!.value).toBe(1)
    expect(digits_.parse("0")!.value).toBe(0)
    expect(digits_.parse("9")!.value).toBe(9)
    expect(digits_.parse("123")!.value).toBe(123)
    expect(digits_.parse("99999999999999")!.value).toBe(99999999999999)
    expect(digits_.parse("aaa")).toBe(null)
  })

  test("factor", () => {
    const factor = c.get("factor")
    expect(factor.parse("1")!.value).toBe(1)
    expect(factor.parse("(1)")!.value).toBe(1)
    expect(factor.parse("((1))")!.value).toBe(1)
    expect(factor.parse("(1+2)")!.value).toBe(1 + 2)
    expect(factor.parse("((1)")).toBe(null)
    expect(factor.parse("1a")!.value).toBe(1)
    expect(factor.parse("1a")!.length).toBe(1)
  })

  test("term", () => {
    const term = c.get("term")
    expect(term.parse("1*1")!.value).toBe(1 * 1)
    expect(term.parse("3*4/5*(2+4)")!.value).toBe(((3 * 4) / 5) * (2 + 4))
    expect(term.parse("3*4/5*(2+4")!.value).toBe((3 * 4) / 5)
  })

  test("expression", () => {
    const expression = c.get("expression")
    expect(expression.parse("1*1+4")!.value).toBe(1 * 1 + 4)
    expect(expression.parse("3*4/5*(2+4)+5*(3+7)")!.value).toBe(
      ((3 * 4) / 5) * (2 + 4) + 5 * (3 + 7)
    )
    expect(expression.parse("3*4/5*6*(2+4")!.value).toBe(((3 * 4) / 5) * 6)
  })
})
