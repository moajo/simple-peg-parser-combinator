import { literal, or } from "../index"
import { sequence } from "../components/sequence"
import { zeroOrOne, repeat0 } from "../components/repeat"
import { __, _ } from "./03.spaces"
import {
  SourceCharacter,
  LineTerminator,
  backslash,
  EscapeSequence,
  LineContinuation,
  kokka_l,
  kakko_l,
  hyphen,
  hat,
  and,
  exclamation,
  dot
} from "./01.literal"
import { notPredicate } from "../components/predicate"
import {
  makeAnyMatcherNode,
  makeCharacterClassMatcherExpressionNode,
  makeCharacterRangeNode,
  makeCharacterNode
} from "./ast"
import { pickSecond } from "../utils"

export const ClassCharacter = or(
  sequence(
    notPredicate(or(kokka_l, backslash, LineTerminator)),
    SourceCharacter
  ).map(pickSecond),
  sequence(backslash, EscapeSequence).map(pickSecond),
  LineContinuation
).map(char => makeCharacterNode(char))

export const ClassCharacterRange = sequence(
  ClassCharacter,
  hyphen,
  ClassCharacter
).map(([s, _, e]) => makeCharacterRangeNode(s.char, e.char))

export const CharacterPart = or(ClassCharacterRange, ClassCharacter)

// [a-z] 的な記法
export const CharacterClassMatcher = sequence(
  kakko_l,
  zeroOrOne(hat).map(a => a != null),
  repeat0(CharacterPart),
  kokka_l,
  zeroOrOne(literal("i")).map(a => a != null)
).map(([_, inverted, parts, __, ignoreCase]) => {
  return makeCharacterClassMatcherExpressionNode(inverted, ignoreCase, parts)
})

// -------------------
export const SemanticPredicateOperator = or(
  and.map(_ => "semantic_and"),
  exclamation.map(_ => "semantic_not")
)

export const AnyMatcher = dot.map(_ => makeAnyMatcherNode())
