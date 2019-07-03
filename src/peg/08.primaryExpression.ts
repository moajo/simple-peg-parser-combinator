import { literal, or } from "../index"
import { sequence } from "../components/sequence"
import { zeroOrOne } from "../components/repeat"
import { _, __ } from "./03.spaces"
import { kakko_s, kokka_s } from "./01.literal"
import { Identifier } from "./04.identifier"
import { notPredicate } from "../components/predicate"
import { StringLiteral, LiteralMatcher } from "./05.string"
import { CodeBlock } from "./01.1.codeblock"
import {
  SemanticPredicateOperator,
  CharacterClassMatcher,
  AnyMatcher
} from "./05.matcher"

export const RuleReferenceExpression = sequence(
  Identifier,
  notPredicate(
    sequence(__, zeroOrOne(sequence(StringLiteral, __)), literal("="))
  )
)

export const SemanticPredicateExpression = sequence(
  SemanticPredicateOperator,
  __,
  CodeBlock
)

export const PrimaryExpression = or(
  LiteralMatcher,
  CharacterClassMatcher as any,
  AnyMatcher as any,
  RuleReferenceExpression as any,
  SemanticPredicateExpression as any,
  sequence(kakko_s, __ as any, "Expression", __ as any, kokka_s) as any
).map(a => {
  // // The purpose of the "group" AST node is just to isolate label scope. We
  // // don't need to put it around nodes that can't contain any labels or
  // // nodes that already isolate label scope themselves.
  // if ( e.type !== "labeled" && e.type !== "sequence" ) return e;

  // // This leaves us with "labeled" and "sequence".
  // return createNode( "group", { expression: e } );
  return a
})
