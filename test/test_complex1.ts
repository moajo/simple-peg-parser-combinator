import { literal, or, repeat1 } from "../src/index"
import ParserContext from "../src/context"
import { sequenceRuntime } from "../src/components/sequence"
import { orRuntime } from "../src/components/or"
import { repeat0Runtime } from "../src/components/repeat"

describe("expression", () => {
  const digits = repeat1(or(...[...Array(10).keys()].map(i => literal(`${i}`))))
  let c = new ParserContext()
  c.add("+", literal("+"))
  c.add("-", literal("-"))
  c.add("*", literal("*"))
  c.add("/", literal("/"))
  c.add("(", literal("("))
  c.add(")", literal(")"))
  c.add("digits", digits)
  c.add("bracedExpression", sequenceRuntime(c, "(", "expression", ")"))
  c.add("factor", orRuntime(c, "bracedExpression", "digits"))

  c.add("*/", orRuntime(c, "*", "/"))
  c.add("+-", orRuntime(c, "+", "-"))
  c.add("termTail1", sequenceRuntime(c, "*/", "factor"))
  c.add("termTail", repeat0Runtime(c, "termTail1"))
  c.add("term", sequenceRuntime(c, "factor", "termTail"))

  c.add("exprTail1", sequenceRuntime(c, "+-", "term"))
  c.add("exprTail", repeat0Runtime(c, "exprTail1"))
  c.add("expression", sequenceRuntime(c, "term", "exprTail"))

  test("digits", () => {
    expect(digits("1")).toBe("1".length)
    expect(digits("0")).toBe("0".length)
    expect(digits("9")).toBe("9".length)
    expect(digits("123")).toBe("123".length)
    expect(digits("99999999999999")).toBe("99999999999999".length)
    expect(digits("aaa")).toBe(null)
  })

  test("factor", () => {
    const factor = c.get("factor")
    expect(factor("1")).toBe("1".length)
    expect(factor("(1)")).toBe("(1)".length)
    expect(factor("((1))")).toBe("((1))".length)
    expect(factor("(1+2)")).toBe("(1+2)".length)
    expect(factor("((1)")).toBe(null)
    expect(factor("1a")).toBe("1".length)
  })

  test("term", () => {
    const term = c.get("term")
    expect(term("1*1")).toBe("1*1".length)
    expect(term("3*4/5*(2+4)")).toBe("3*4/5*(2+4)".length)
    expect(term("3*4/5*(2+4")).toBe("3*4/5".length)
  })

  test("expression", () => {
    const expression = c.get("expression")
    expect(expression("1*1+4")).toBe("1*1+4".length)
    expect(expression("3*4/5*(2+4)+5*(3+7)")).toBe("3*4/5*(2+4)+5*(3+7)".length)
    expect(expression("3*4/5*6*(2+4")).toBe("3*4/5*6".length)
  })
})
