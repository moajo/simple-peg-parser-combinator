import { or, sequence } from "../index"
import { notPredicate } from "../components/predicate"
import { kakko_m, kokka_m, SourceCharacter } from "./01.literal"
import { repeat0, repeat1 } from "../components/repeat"

export const Code = repeat0(
  or(
    repeat1(sequence(notPredicate(or(kakko_m, kokka_m)), SourceCharacter)),
    sequence(kakko_m, "Code", kokka_m)
  )
)

export const CodeBlock = sequence(kakko_m, Code, kokka_m)
