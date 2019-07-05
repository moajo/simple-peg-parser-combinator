import { or, sequence, repeat0, notPredicate } from "../index"
import {
  SourceCharacter,
  kakko_comment,
  kokka_comment,
  comment_head,
  LineTerminator
} from "./01.literal"

export const MultiLineComment = sequence(
  kakko_comment,
  repeat0(sequence(notPredicate(kokka_comment), SourceCharacter)),
  kokka_comment
)

export const MultiLineCommentNoLineTerminator = sequence(
  kakko_comment,
  repeat0(
    sequence(notPredicate(or(kokka_comment, LineTerminator)), SourceCharacter)
  ),
  kokka_comment
)

export const SingleLineComment = sequence(
  comment_head,
  repeat0(sequence(notPredicate(LineTerminator), SourceCharacter))
)

export const Comment = or(MultiLineComment, SingleLineComment)
