import { Parser, ParseResult } from "../types"
import ParserResolver from "../context"

export const sequence = (...parsers: Parser<any>[]) =>
  new Parser((pc, s: string) => {
    let total = 0
    let values = []
    for (const parser of parsers) {
      const result = parser.parse(pc, s)
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

export const sequenceRuntime = (
  context: ParserResolver,
  ...parsers: string[]
) =>
  new Parser((pc, s: string) => {
    let total = 0
    let values = []
    for (const parserName of parsers) {
      const parser = context.get(parserName)
      const result = parser.parse(pc, s)
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
