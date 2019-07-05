import { literal, or, sequence, anyChar } from "../index"
import { Zs, Lu, Ll, Lt, Lm, Lo, Nl, Mn, Mc, Nd, Pc } from "./00.unicode"
import { between } from "../components/utils"
import { notPredicate } from "../components/predicate"
import { pickSecond } from "../utils"

export const dollar = literal("$")
export const and = literal("&")
export const equal = literal("=")
export const atmark = literal("@")
export const slash = literal("/")
export const question = literal("?")
export const exclamation = literal("!")
export const underscore = literal("_")
export const semicolon = literal(";")
export const colon = literal(":")
export const dot = literal(".")
export const star = literal("*")
export const plus = literal("+")
export const backslash = literal("\\")
export const hyphen = literal("-")
export const hat = literal("^")
export const double_quote = literal('"')
export const single_quote = literal("'")

export const kakko_s = literal("(")
export const kokka_s = literal(")")
export const kakko_m = literal("{")
export const kokka_m = literal("}")
export const kakko_l = literal("[")
export const kokka_l = literal("]")

export const kakko_comment = literal("/*")
export const kokka_comment = literal("*/")
export const comment_head = literal("//")

export const SourceCharacter = anyChar
export const WhiteSpace = or(
  literal("\t"),
  literal("\v"),
  literal("\f"),
  literal(" "),
  literal("\u00A0"),
  literal("\uFEFF"),
  Zs
)

export const LineTerminator = or(
  literal("\n"),
  literal("\r"),
  literal("\u2028"),
  literal("\u2029")
)
export const LineTerminatorSequence = or(
  literal("\n"),
  literal("\r\n"),
  literal("\r"),
  literal("\u2028"),
  literal("\u2029")
)

export const UnicodeLetter = or(Lu, Ll, Lt, Lm, Lo, Nl)

export const UnicodeCombiningMark = or(Mn, Mc)

export const UnicodeDigit = Nd

export const UnicodeConnectorPunctuation = Pc

export const SingleEscapeCharacter = or(
  literal("'"),
  literal('"'),
  backslash,
  literal("b").mapTo("\b"),
  literal("f").mapTo("\f"),
  literal("n").mapTo("\n"),
  literal("r").mapTo("\r"),
  literal("t").mapTo("\t"),
  literal("v").mapTo("\v")
)

export const DecimalDigit = between("0", "9")
export const HexDigit = or(
  between("0", "9"),
  between("a", "f"),
  between("A", "F")
)

export const EscapeCharacter = or(
  SingleEscapeCharacter,
  DecimalDigit,
  literal("x"),
  literal("u")
)

export const LineContinuation = sequence(
  backslash,
  LineTerminatorSequence
).mapTo("")

export const NonEscapeCharacter = sequence(
  notPredicate(or(EscapeCharacter, LineTerminator)),
  SourceCharacter
).map(pickSecond)
export const CharacterEscapeSequence = or(
  SingleEscapeCharacter,
  NonEscapeCharacter
)

export const HexEscapeSequence = sequence(
  literal("x"),
  sequence(HexDigit, HexDigit)
).map(([_, [d1, d2]]) => String.fromCharCode(parseInt(d1 + d2, 16)))
export const UnicodeEscapeSequence = sequence(
  literal("u"),
  sequence(HexDigit, HexDigit, HexDigit, HexDigit)
).map(([_, [d1, d2, d3, d4]]) =>
  String.fromCharCode(parseInt(d1 + d2 + d3 + d4, 16))
)

export const EscapeSequence = or(
  CharacterEscapeSequence,
  sequence(literal("0"), notPredicate(DecimalDigit)).map(_ => "\0"),
  HexEscapeSequence,
  UnicodeEscapeSequence
)
