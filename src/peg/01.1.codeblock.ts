import { or, sequence, repeat0, repeat1, notPredicate } from "../index"
import { kakko_m, kokka_m, SourceCharacter } from "./01.literal"
import { pickCenter, pickSecond } from "../utils"
import { ParserIdentifier } from "../types"

export const Code = repeat0(
  or(
    repeat1(
      sequence(notPredicate(or(kakko_m, kokka_m)), SourceCharacter).map(
        pickSecond
      )
    ).map(a => a.join("")),
    sequence(kakko_m, "Code" as ParserIdentifier<string>, kokka_m).map(
      ([_, b, __]) => {
        return "{" + b + "}"
      }
    )
  )
).map(a => a.join("\n"))

export const CodeBlock = sequence(kakko_m, Code, kokka_m).map(pickCenter)
