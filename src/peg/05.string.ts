import { literal, or, sequence, repeat0, notPredicate } from "../index"
import {
  LineTerminator,
  SourceCharacter,
  backslash,
  EscapeSequence,
  LineContinuation
} from "./01.literal"
import { __, _ } from "./03.spaces"
import { zeroOrOne } from "../components/repeat"

export const DoubleStringCharacter = or(
  sequence(
    notPredicate(or(literal('"'), backslash, LineTerminator)),
    SourceCharacter
  ),
  sequence(backslash, EscapeSequence),
  LineContinuation
)

export const SingleStringCharacter = or(
  sequence(
    notPredicate(or(literal("'"), backslash, LineTerminator)),
    SourceCharacter
  ),
  sequence(backslash, EscapeSequence),
  LineContinuation
)

export const StringLiteral = or(
  sequence(literal('"'), repeat0(DoubleStringCharacter), literal('"')),
  sequence(literal("'"), repeat0(SingleStringCharacter), literal("'"))
)

export const LiteralMatcher = sequence(
  StringLiteral,
  zeroOrOne(literal("i"))
).map(a => {
  // return createNode("literal", {
  //   value: value,
  //   ignoreCase: ignoreCase !== null
  // })
  return a
})
