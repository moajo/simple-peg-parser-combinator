import {
  zeroOrOne,
  literal,
  or,
  sequence,
  repeat0,
  notPredicate
} from "../index"
import {
  LineTerminator,
  SourceCharacter,
  backslash,
  EscapeSequence,
  LineContinuation,
  single_quote,
  double_quote
} from "./01.literal"
import { __, _ } from "./03.spaces"

export const DoubleStringCharacter = or(
  sequence(
    notPredicate(or(double_quote, backslash, LineTerminator)),
    SourceCharacter
  ),
  sequence(backslash, EscapeSequence),
  LineContinuation
)

export const SingleStringCharacter = or(
  sequence(
    notPredicate(or(single_quote, backslash, LineTerminator)),
    SourceCharacter
  ),
  sequence(backslash, EscapeSequence),
  LineContinuation
)

export const StringLiteral = or(
  sequence(double_quote, repeat0(DoubleStringCharacter), double_quote),
  sequence(single_quote, repeat0(SingleStringCharacter), single_quote)
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
