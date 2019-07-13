import { ParserResolver, ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression } from "../src/peg/07.grammer"
import * as fs from "fs"
import { compile } from "../src/peg/compiler"
import { Code } from "../src/peg/03.codeBlock"

const arithmetics_src = fs.readFileSync(
  "./sample_files/peg/arithmetics.pegjs",
  {
    encoding: "utf8"
  }
)

describe("compiler", () => {
  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)

  test("compiler", () => {
    const pr = new ParserResolver()
    const pc = new ParseContext(new ParserCache(), pr)
    pr.add("Expression", Expression)
    pr.add("Code", Code)
    const ast = Grammar.parse(pc, arithmetics_src, 0)!.value
    const res = compile(ast)
    expect(res.parse("1")!.value).toBe(1)
    expect(res.parse("1*1+4")!.value).toBe(1 * 1 + 4)
    expect(res.parse("3*4/5*(2+4)+5*(3+7)")!.value).toBe(
      ((3 * 4) / 5) * (2 + 4) + 5 * (3 + 7)
    )
    expect(res.parse("3*4/5*6*(2+4")!.value).toBe(((3 * 4) / 5) * 6)
  })
})
