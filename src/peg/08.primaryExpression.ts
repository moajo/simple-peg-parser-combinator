import { or, notPredicate, zeroOrOne, sequence } from "../index"
import { _, __ } from "./03.spaces"
import { kakko_s, kokka_s, equal } from "./01.literal"
import { Identifier } from "./04.identifier"
import { StringLiteral, LiteralMatcher } from "./05.string"
import { CodeBlock } from "./01.1.codeblock"
import {
  SemanticPredicateOperator,
  CharacterClassMatcher,
  AnyMatcher
} from "./05.matcher"
import { pickFirst } from "../utils"
import { RuleReferenceNode, SemanticPredicateNode, ExpressionNode } from "./ast"
import { ParserIdentifier } from "../types"

export const RuleReferenceExpression = sequence(
  Identifier,
  notPredicate(sequence(__, zeroOrOne(sequence(StringLiteral, __)), equal))
)
  .map(pickFirst)
  .map(name => new RuleReferenceNode(name))

export const SemanticPredicateExpression = sequence(
  SemanticPredicateOperator,
  __,
  CodeBlock
).map(([a, _, c]) => new SemanticPredicateNode(a, c))

export const PrimaryExpression = or(
  LiteralMatcher,
  CharacterClassMatcher,
  AnyMatcher,
  RuleReferenceExpression,
  SemanticPredicateExpression,
  sequence(
    kakko_s,
    __,
    "Expression" as ParserIdentifier<ExpressionNode>,
    __,
    kokka_s
  ).map(a => a[2])
).map(a => {
  // // The purpose of the "group" AST node is just to isolate label scope. We
  // // don't need to put it around nodes that can't contain any labels or
  // // nodes that already isolate label scope themselves.
  // if ( e.type !== "labeled" && e.type !== "sequence" ) return e;

  // // This leaves us with "labeled" and "sequence".
  // return createNode( "group", { expression: e } );
  return a as ExpressionNode
})
