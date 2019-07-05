import { Parser } from "../types"
import { GrammerNode, Node } from "./ast"
import { literal } from "../components/literal"
import { anyChar } from "../components/any"

const _compile: (node: Node) => Parser<string> = node => {
  switch (node.type) {
    case "LiteralMatcher":
      return literal(node.str, node.ignoreCase)
    case "AnyMatcher":
      return anyChar
  }
  throw new Error(`unexpected node type: ${node.type}`)
}

export const compile: (ast: GrammerNode) => Parser<string> = ast =>
  _compile(ast)
