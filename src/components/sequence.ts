import { Parser, ParseResult, ParserIdentifier } from "../types"

export const sequence = (...parsers: ParserIdentifier<any>[]) =>
  new Parser((pc, s: string) => {
    let total = 0
    let values = []
    for (let parser of parsers) {
      if (typeof parser == "string") {
        parser = pc.resolver.get(parser)
      }
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
