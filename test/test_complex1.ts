import { literal, or, repeat1 } from "../src/index"
import ParserContext from "../src/context"
import { sequenceRuntime } from "../src/components/sequence"
import { orRuntime } from "../src/components/or"
import { repeat0Runtime } from "../src/components/repeat"

describe("expression", () => {
  const digits = repeat1(
    or(
      ...[...Array(10).keys()].map(i => literal(`${i}`, s => parseInt(s, 10)))
    ),
    arr => (arr as number[]).reduce((prev, current) => prev * 10 + current)
  )
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
    sequenceRuntime(c, vs => vs[1], "(", "expression", ")")
  )
  c.add("factor", orRuntime(c, "bracedExpression", "digits"))

  c.add("*/", orRuntime(c, "*", "/"))
  c.add("+-", orRuntime(c, "+", "-"))
  c.add(
    "termTail1",
    sequenceRuntime(
      c,
      vs => {
        return vs[0] == "*"
          ? (a: number) => a * vs[1]
          : (a: number) => a / vs[1]
      },
      "*/",
      "factor"
    )
  )
  c.add("termTail", repeat0Runtime(c, "termTail1"))
  c.add(
    "term",
    sequenceRuntime(
      c,
      vs => {
        let r = vs[0]
        for (let i = 0; i < vs[1].length; i++) {
          r = vs[1][i](r)
        }
        return r
      },
      "factor",
      "termTail"
    )
  )

  c.add(
    "exprTail1",
    sequenceRuntime(
      c,
      vs =>
        vs[0] == "+" ? (a: number) => a + vs[1] : (a: number) => a - vs[1],
      "+-",
      "term"
    )
  )
  c.add("exprTail", repeat0Runtime(c, "exprTail1"))
  c.add(
    "expression",
    sequenceRuntime(
      c,
      vs => {
        let r = vs[0]
        for (let i = 0; i < vs[1].length; i++) {
          r = vs[1][i](r)
        }
        return r
      },
      "term",
      "exprTail"
    )
  )

  test("digits", () => {
    expect(digits("1").value).toBe(1)
    expect(digits("0").value).toBe(0)
    expect(digits("9").value).toBe(9)
    expect(digits("123").value).toBe(123)
    expect(digits("99999999999999").value).toBe(99999999999999)
    expect(digits("aaa")).toBe(null)
  })

  test("factor", () => {
    const factor = c.get("factor")
    expect(factor("1").value).toBe(1)
    expect(factor("(1)").value).toBe(1)
    expect(factor("((1))").value).toBe(1)
    expect(factor("(1+2)").value).toBe(1 + 2)
    expect(factor("((1)")).toBe(null)
    expect(factor("1a").value).toBe(1)
    expect(factor("1a").length).toBe(1)
  })

  test("term", () => {
    const term = c.get("term")
    expect(term("1*1").value).toBe(1 * 1)
    expect(term("3*4/5*(2+4)").value).toBe(((3 * 4) / 5) * (2 + 4))
    expect(term("3*4/5*(2+4").value).toBe((3 * 4) / 5)
  })

  test("expression", () => {
    const expression = c.get("expression")
    expect(expression("1*1+4").value).toBe(1 * 1 + 4)
    expect(expression("3*4/5*(2+4)+5*(3+7)").value).toBe(
      ((3 * 4) / 5) * (2 + 4) + 5 * (3 + 7)
    )
    expect(expression("3*4/5*6*(2+4").value).toBe(((3 * 4) / 5) * 6)
  })
})
