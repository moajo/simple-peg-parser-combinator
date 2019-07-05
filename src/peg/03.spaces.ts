import { or, repeat0, EOF, sequence, zeroOrOne } from "../index"
import { WhiteSpace, LineTerminatorSequence, semicolon } from "./01.literal"
import {
  Comment,
  MultiLineCommentNoLineTerminator,
  SingleLineComment
} from "./02.comment"

export const __ = repeat0(
  or(WhiteSpace, LineTerminatorSequence, Comment)
).mapTo("")
export const _ = repeat0(
  or(WhiteSpace, MultiLineCommentNoLineTerminator)
).mapTo("")

export const EOS = or(
  sequence(__, semicolon),
  sequence(_, zeroOrOne(SingleLineComment), LineTerminatorSequence),
  sequence(__, EOF)
).mapTo("")
