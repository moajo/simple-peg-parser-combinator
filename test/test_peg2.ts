import { ParserResolver, ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression } from "../src/peg/07.grammar"
import * as fs from "fs"
import { Code } from "../src/peg/03.codeBlock"

const src = fs.readFileSync("./sample_files/peg/pegjs.pegjs", {
  encoding: "utf8"
})

test("grammar", () => {
  const pr = new ParserResolver()
  const pc = new ParseContext(new ParserCache(), pr)
  pr.add("Expression", Expression)
  pr.add("Code", Code)
  expect(Grammar.parse(pc, src)!).not.toBe(null)
})
