import { Parser, ParserOrLiteral } from "../types"
import { toParser } from "../utils"

export const repeat = <T>(parser: ParserOrLiteral<T>, minCount: number) =>
  new Parser((pc, s, pos) => {
    let c = 0
    let total = 0
    let values: any[] = []
    while (true) {
      const result = toParser<T>(parser).parse(pc, s, pos)
      if (result === null) {
        break
      }
      total += result.length
      values.push(result.value)
      c += 1
      pos += result.length
    }
    if (c < minCount) {
      return null
    }
    return {
      length: total,
      value: values as T[]
    }
  })

// 1 or more
export const repeat1 = <T>(parser: Parser<T>) => repeat(parser, 1)

// 0 or more
export const repeat0 = <T>(parser: Parser<T>) => repeat(parser, 0)

export const zeroOrOne = <T>(parser: Parser<T>) =>
  new Parser((pc, s, pos) => {
    const result = parser.parse(pc, s, pos)
    if (result) {
      return result
    } else {
      return {
        length: 0,
        value: null
      }
    }
  })
