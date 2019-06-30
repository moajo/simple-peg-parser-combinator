import { Parser } from "../types"
import ParserContext from "../context"

export const or = (...parsers: Parser<any>[]) => (s: string) => {
  for (const parser of parsers) {
    const result = parser(s)
    if (result !== null) {
      return result
    }
  }
  return null
}

export const orRuntime = (c: ParserContext, ...parsers: string[]) => (
  s: string
) => {
  for (const parser of parsers) {
    const result = c.get(parser)(s)
    if (result !== null) {
      return result
    }
  }
  return null
}
