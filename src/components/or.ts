import { Parser, ParserIdentifier } from "../types"
import { resolveParser } from "../utils"

export function or<T>(p1: ParserIdentifier<T>): Parser<T>
export function or<T1, T2>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>
): Parser<T1 | T2>
export function or<T1, T2, T3>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>
): Parser<T1 | T2 | T3>
export function or<T>(...parsers: ParserIdentifier<T>[]): Parser<T>

export function or(...parsers: ParserIdentifier<any>[]) {
  return new Parser((c, s: string) => {
    for (let parser of parsers) {
      const result = resolveParser(parser, c.resolver).parse(c, s)
      if (result !== null) {
        return result
      }
    }
    return null
  })
}
