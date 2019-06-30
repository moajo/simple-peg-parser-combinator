import { Parser } from "../types"
import ParserContext from "../context"

export const or = (...parsers: Parser<any>[]) =>
  new Parser((s: string) => {
    for (const parser of parsers) {
      const result = parser.parse(s)
      if (result !== null) {
        return result
      }
    }
    return null
  })

export const orRuntime = (c: ParserContext, ...parsers: string[]) =>
  new Parser((s: string) => {
    for (const parser of parsers) {
      const result = c.get(parser).parse(s)
      if (result !== null) {
        return result
      }
    }
    return null
  })
