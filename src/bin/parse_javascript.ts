import ParserResolver, { ParseContext, ParserCache } from "../context"
import { Grammar, Expression } from "../peg/09.grammer"
import * as fs from "fs"
import { Code } from "../peg/01.1.codeblock"
import { compile } from "../peg/compiler"
import { GrammerNode } from "../peg/ast"

const pegSource = "./peg/javascript.pegjs"
const pegCompiled = "./peg/javascript.pegjs.ast.json"

if (!fs.existsSync(pegCompiled)) {
  console.log("no cache")

  const js_syntax_definition = fs.readFileSync(pegSource, {
    encoding: "utf8"
  })

  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)

  const pc = new ParseContext(new ParserCache(), pr)
  const ast = Grammar.parse(pc, js_syntax_definition)!.value

  fs.writeFileSync(pegCompiled, JSON.stringify(ast, null, 2))
}

const ast = JSON.parse(
  fs.readFileSync(pegCompiled, {
    encoding: "utf8"
  })
) as GrammerNode

const js_parser = compile(ast)

console.log(
  JSON.stringify(
    js_parser.parse('var img_front = document.createElement("img");')!.value,
    null,
    2
  )
)
