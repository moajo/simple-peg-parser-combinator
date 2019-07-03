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
import { pickSecond, pickCenter } from "../utils"
import { LiteralMatcherNode } from "./ast"

export const DoubleStringCharacter = or(
  sequence(
    notPredicate(or(double_quote, backslash, LineTerminator)),
    SourceCharacter
  ).map(pickSecond),
  sequence(backslash, EscapeSequence).map(pickSecond),
  LineContinuation
)

export const SingleStringCharacter = or(
  sequence(
    notPredicate(or(single_quote, backslash, LineTerminator)),
    SourceCharacter
  ).map(pickSecond),
  sequence(backslash, EscapeSequence).map(pickSecond),
  LineContinuation
)

export const StringLiteral = or(
  sequence(
    double_quote,
    repeat0(DoubleStringCharacter).map(a => a.join("")),
    double_quote
  ).map(pickCenter),
  sequence(
    single_quote,
    repeat0(SingleStringCharacter).map(a => a.join("")),
    single_quote
  ).map(pickCenter)
)

export const LiteralMatcher = sequence(
  StringLiteral,
  zeroOrOne(literal("i")).map(v => v !== null)
).map(([str, ignoreCase]) => new LiteralMatcherNode(str, ignoreCase))
