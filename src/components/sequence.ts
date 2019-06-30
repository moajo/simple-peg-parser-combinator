import { Parser } from "../types"
import ParserContext from "../context"

export const sequence = (...parsers: Parser[]) => (s: string) => {
  let total = 0
  for (const parser of parsers) {
    const result = parser(s)
    if (result === null) {
      return null
    }
    total += result
    s = s.substr(result)
  }
  return total
}

export const sequenceRuntime = (
  context: ParserContext,
  ...parsers: string[]
) => (s: string) => {
  let total = 0
  for (const parserName of parsers) {
    const parser = context.get(parserName)
    const result = parser(s)
    if (result === null) {
      return null
    }
    total += result
    s = s.substr(result)
  }
  return total
}
