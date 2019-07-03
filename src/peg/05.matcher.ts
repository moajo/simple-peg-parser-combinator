import { literal, or } from "../index"
import { sequence } from "../components/sequence"
import { zeroOrOne, repeat0 } from "../components/repeat"
import { __, _ } from "./03.spaces"
import {
  SourceCharacter,
  LineTerminator,
  backslash,
  EscapeSequence,
  LineContinuation
} from "./01.literal"
import { notPredicate } from "../components/predicate"

export const ClassCharacter = or(
  sequence(
    notPredicate(or(literal("]"), literal("\\"), LineTerminator)),
    SourceCharacter
  ),
  sequence(backslash, EscapeSequence),
  LineContinuation
)

export const ClassCharacterRange = sequence(
  ClassCharacter,
  literal("-"),
  ClassCharacter
)

export const CharacterPart = or(ClassCharacterRange, ClassCharacter)

// [a-z] 的な記法
export const CharacterClassMatcher = sequence(
  literal("["),
  zeroOrOne(literal("^")),
  repeat0(CharacterPart) as any,
  literal("]"),
  zeroOrOne(literal("i"))
)

// -------------------
export const SemanticPredicateOperator = or(
  literal("&").map(_ => "semantic_and"),
  literal("!").map(_ => "semantic_not")
)

export const AnyMatcher = literal(".")
