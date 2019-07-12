import { ParserResolver } from "../src/context"
import { Expression, PEG } from "../src/peg/07.grammer"
import * as fs from "fs"
import { compile } from "../src/peg/compiler"
import { Code } from "../src/peg/03.codeBlock"

const parser_generator_syntax_definition = fs.readFileSync(
  "./sample_files/peg/pegjs.ported.pegjs",
  {
    encoding: "utf8"
  }
)

describe("compiler", () => {
  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)

  test("compiler", () => {
    const original_ast = PEG.parse(parser_generator_syntax_definition)!.value
    const original_parser = compile(original_ast)

    const self_hosted_ast = original_parser.parse(
      parser_generator_syntax_definition
    )
    expect(self_hosted_ast).not.toBe(null)
    expect(self_hosted_ast!.value.type).toStrictEqual("Grammer")
    expect(self_hosted_ast!.value).toStrictEqual(original_ast)
  })
})
