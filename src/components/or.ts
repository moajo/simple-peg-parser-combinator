import { Parser, ParserIdentifier } from "../types"

export const or = (...parsers: ParserIdentifier<any>[]) =>
  new Parser((c, s: string) => {
    for (let parser of parsers) {
      if (typeof parser == "string") {
        parser = c.resolver.get(parser)
      }
      const result = parser.parse(c, s)
      if (result !== null) {
        return result
      }
    }
    return null
  })
