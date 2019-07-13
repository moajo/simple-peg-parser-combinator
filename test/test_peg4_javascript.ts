import { ParserResolver } from "../src/context"
import { Expression, PEG } from "../src/peg/07.grammar"
import * as fs from "fs"
import { compile } from "../src/peg/compiler"
import { Code } from "../src/peg/03.codeBlock"

const js_syntax_definition = fs.readFileSync(
  "./sample_files/peg/javascript.pegjs",
  {
    encoding: "utf8"
  }
)

describe("compiler", () => {
  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)

  test("compiler", () => {
    const ast = PEG.parse(js_syntax_definition)!.value
    const js_parser = compile(ast)
    expect(js_parser.parse("1")!.value).toStrictEqual({
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
    expect(js_parser.parse("1+1")!.value).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Literal",
              value: 1
            },
            right: {
              type: "Literal",
              value: 1
            }
          }
        }
      ]
    })

    expect(
      js_parser.parse('var img_front = document.createElement("img");')!.value
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
