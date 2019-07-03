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
import { AnyMatcherNode } from "./ast"

export const ClassCharacter = or(
  sequence(
    notPredicate(or(kokka_l, backslash, LineTerminator)),
    SourceCharacter
  ),
  sequence(backslash, EscapeSequence),
  LineContinuation
)

export const ClassCharacterRange = sequence(
  ClassCharacter,
  hyphen,
  ClassCharacter
)

export const CharacterPart = or(ClassCharacterRange, ClassCharacter)

// [a-z] 的な記法
export const CharacterClassMatcher = sequence(
  kakko_l,
  zeroOrOne(hat),
  repeat0(CharacterPart) as any,
  kokka_l,
  zeroOrOne(literal("i"))
)

// -------------------
export const SemanticPredicateOperator = or(
  and.map(_ => "semantic_and"),
  exclamation.map(_ => "semantic_not")
)

export const AnyMatcher = dot.map(_ => new AnyMatcherNode())
