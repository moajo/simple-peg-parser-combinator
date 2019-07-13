import { pickFirst } from "../utils"
import { or, sequence, repeat0, repeat1, notPredicate, ref } from "../index"
import { kakko_m, kokka_m, SourceCharacter } from "./01.literal"
import { pickCenter, pickSecond } from "../utils"
import { EOS } from "./02.blank"
import { Parser } from "../types"

export const Code = repeat0(
  or(
    repeat1(
      sequence(notPredicate(or(kakko_m, kokka_m)), SourceCharacter).map(
        pickSecond
      )
    ).map(a => a.join("")),
    sequence(kakko_m, ref("Code") as Parser<string>, kokka_m).map(
      ([_, b, __]) => {
        return "{" + b + "}"
      }
    )
  )
).map(a => a.join(""))

export const CodeBlock = sequence(kakko_m, Code, kokka_m).map(pickCenter)

export const Initializer = sequence(CodeBlock, EOS).map(pickFirst)
