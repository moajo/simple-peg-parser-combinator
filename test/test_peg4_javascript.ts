import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression } from "../src/peg/09.grammer"
import * as fs from "fs"
import { Code } from "../src/peg/01.1.codeblock"
import { compile } from "../src/peg/compiler"

const javascript_src = fs.readFileSync("./peg/javascript.pegjs", {
  encoding: "utf8"
})

describe("compiler", () => {
  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)

  test("compiler", () => {
    const pr = new ParserResolver()
    const pc = new ParseContext(new ParserCache(), pr)
    pr.add("Expression", Expression)
    pr.add("Code", Code)
    const ast = Grammar.parse(pc, javascript_src)!.value
    // console.log(JSON.stringify(ast, null, 2))
    const res = compile(ast)
    expect(res.parse("1")!.value).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "Literal",
            value: 1
          }
        }
      ]
    })
    expect(
      res.parse('var img_front = document.createElement("img");')!.value
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableDeclaration",
          declarations: [
            {
              type: "VariableDeclarator",
              id: {
                type: "Identifier",
                name: "img_front"
              },
              init: {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name: "document"
                  },
                  property: {
                    type: "Identifier",
                    name: "createElement"
                  },
                  computed: false
                },
                arguments: [
                  {
                    type: "Literal",
                    value: "img"
                  }
                ]
              }
            }
          ],
          kind: "var"
        }
      ]
    })
  })
})
