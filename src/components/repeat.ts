import { Parser, ParserIdentifier } from "../types"
import { ParseResult } from "../types"

export const repeat = (parserId: ParserIdentifier<any>, minCount: number) =>
  new Parser((pc, s: string) => {
    let c = 0
    let total = 0
    let values = []
    while (true) {
      const parser =
        typeof parserId === "string" ? pc.resolver.get(parserId) : parserId
      const result = parser.parse(pc, s)
      if (result === null) {
        break
      }
      total += result.length
      values.push(result.value)
      c += 1
      s = s.substr(result.length)
    }
    if (c < minCount) {
      return null
    }
    return {
      length: total,
      value: values
    } as ParseResult<any[]>
  })

// 1 or more
export const repeat1 = (parser: ParserIdentifier<any>) => repeat(parser, 1)

// 0 or more
export const repeat0 = (parser: ParserIdentifier<any>) => repeat(parser, 0)

export const zeroOrOne = (parserName: string) =>
  new Parser((pc, s: string) => {
    const result = pc.resolver.get(parserName).parse(pc, s)
    if (result) {
      return result
    } else {
      return {
        length: 0,
        value: null
      }
    }
  })
