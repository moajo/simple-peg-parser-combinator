import { Parser, ParseResult } from "../types"
import ParserContext from "../context"

export const sequence = (...parsers: Parser<any>[]) => (s: string) => {
  let total = 0
  let values = []
  for (const parser of parsers) {
    const result = parser(s)
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
}

export const sequenceRuntime = (
  context: ParserContext,
  mapper: (value: any[]) => any,
  ...parsers: string[]
) => (s: string) => {
  let total = 0
  let values = []
  for (const parserName of parsers) {
    const parser = context.get(parserName)
    const result = parser(s)
    if (result === null) {
      return null
    }
    total += result.length
    values.push(result.value)
    s = s.substr(result.length)
  }
  return {
    length: total,
    value: mapper ? mapper(values) : values
  } as ParseResult<any[]>
}
