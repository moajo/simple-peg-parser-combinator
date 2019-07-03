import { literal, or, sequence, repeat0 } from "../index"
import {
  UnicodeLetter,
  UnicodeEscapeSequence,
  UnicodeCombiningMark,
  UnicodeDigit,
  UnicodeConnectorPunctuation
} from "./01.literal"
import { __, _ } from "./03.spaces"

export const IdentifierStart = or(
  UnicodeLetter,
  literal("$"),
  literal("_"),
  sequence(literal("\\"), UnicodeEscapeSequence) as any
)
export const IdentifierPart = or(
  IdentifierStart,
  UnicodeCombiningMark,
  UnicodeDigit,
  UnicodeConnectorPunctuation,
  literal("\u200C"),
  literal("\u200D")
)
export const Identifier = sequence(IdentifierStart, repeat0(IdentifierPart))
