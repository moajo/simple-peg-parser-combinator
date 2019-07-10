import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression } from "../src/peg/09.grammer"
import * as fs from "fs"
import { Code } from "../src/peg/01.1.codeblock"
import { compile } from "../src/peg/compiler"

const parser_generator_syntax_definition = fs.readFileSync(
  "./peg/pegjs.ported.pegjs",
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
    const original_ast = Grammar.parse(pc, parser_generator_syntax_definition)!
      .value
    const original_parser_generator = compile(original_ast)

    const self_hosted_ast = original_parser_generator.parse(
      parser_generator_syntax_definition
    )
    expect(self_hosted_ast).not.toBe(null)
    expect(self_hosted_ast!.value.type).toStrictEqual("Grammer")
    expect(self_hosted_ast!.value).toStrictEqual(original_ast)
  })
})
