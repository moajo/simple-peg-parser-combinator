import { literal, or, sequence, ref } from "../src/index"
import { ParserResolver, ParseContext, ParserCache } from "../src/context"

describe("expression", () => {
  let c = new ParserResolver()
  const kakko = literal("(")
  const kokka = literal(")")
  const one = literal("1")
  const plus = literal("+")
  const minus = literal("-")
  const P = or(sequence(kakko, ref("A"), kokka), one)
  const A = or(sequence(P, plus, ref("A")), sequence(P, minus, ref("A")), P)

  c.add("A", A)
  c.add("S", A)

  test("1", () => {
    const S = c.get("S")
    const pc = new ParseContext(new ParserCache(), c)
    expect(S.parse(pc, "1")).not.toBe(null)
  })
  test("1", () => {
    const S = c.get("S")
    const pc = new ParseContext(new ParserCache(), c)
    // note: this expression take too much time to parse if packrat-cache is disabled.
    // ref: http://kmizu.hatenablog.com/entry/20090226/1235649181
    expect(S.parse(pc, "(((((((((((((1)))))))))))))")).not.toBe(null)
  })
})
