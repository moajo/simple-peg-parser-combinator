import { or, sequence, repeat0, repeat1, notPredicate } from "../index"
import { kakko_m, kokka_m, SourceCharacter } from "./01.literal"

export const Code = repeat0(
  or(
    repeat1(sequence(notPredicate(or(kakko_m, kokka_m)), SourceCharacter)),
    sequence(kakko_m, "Code", kokka_m)
  )
)

export const CodeBlock = sequence(kakko_m, Code, kokka_m)
