import { Parser, ParseResult } from "../types"
import ParserContext from "../context"

export const sequence = (...parsers: Parser<any>[]) =>
  new Parser((s: string) => {
    let total = 0
    let values = []
    for (const parser of parsers) {
      const result = parser.parse(s)
      if (result === null) {
        return null
      }
      total += result.length
      values.push(result.value)
      s = s.substr(result.length)
    }
    return {
      length: total,
      value: values
    } as ParseResult<any[]>
  })

export const sequenceRuntime = (context: ParserContext, ...parsers: string[]) =>
  new Parser((s: string) => {
    let total = 0
    let values = []
    for (const parserName of parsers) {
      const parser = context.get(parserName)
      const result = parser.parse(s)
      if (result === null) {
        return null
      }
      total += result.length
      values.push(result.value)
      s = s.substr(result.length)
    }
    return {
      length: total,
      value: values
    } as ParseResult<any[]>
  })
