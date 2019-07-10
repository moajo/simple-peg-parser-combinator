import { ParserResolver, ParseContext, ParserCache } from "../context"
import { Grammar, Expression } from "../peg/07.grammer"
import * as fs from "fs"
import { Code } from "../peg/03.codeBlock"

const pegSource = "./peg/javascript.pegjs"

const js_syntax_definition = fs.readFileSync(pegSource, {
  encoding: "utf8"
})

const pr = new ParserResolver()
pr.add("Expression", Expression)
pr.add("Code", Code)

const pc = new ParseContext(new ParserCache(), pr)
const ast = Grammar.parse(pc, js_syntax_definition)!.value

console.log(JSON.stringify(ast, null, 2))
