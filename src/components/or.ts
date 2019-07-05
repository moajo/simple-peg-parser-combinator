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
export function or<T1, T2, T3, T4>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>
): Parser<T1 | T2 | T3 | T4>
export function or<T1, T2, T3, T4, T5>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>,
  p5: ParserIdentifier<T5>
): Parser<T1 | T2 | T3 | T4 | T5>
export function or<T1, T2, T3, T4, T5, T6>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>,
  p5: ParserIdentifier<T5>,
  p6: ParserIdentifier<T6>
): Parser<T1 | T2 | T3 | T4 | T5 | T6>
export function or<T>(...parsers: ParserIdentifier<T>[]): Parser<T>
export function or(...parsers: ParserIdentifier<any>[]): Parser<any>

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
