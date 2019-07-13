import { Parser, ParserOrLiteral } from "../types"
import { toParser } from "../utils"

export function or<T>(p1: ParserOrLiteral<T>): Parser<T>
export function or<T1, T2>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>
): Parser<T1 | T2>
export function or<T1, T2, T3>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>
): Parser<T1 | T2 | T3>
export function or<T1, T2, T3, T4>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>
): Parser<T1 | T2 | T3 | T4>
export function or<T1, T2, T3, T4, T5>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>,
  p5: ParserOrLiteral<T5>
): Parser<T1 | T2 | T3 | T4 | T5>
export function or<T1, T2, T3, T4, T5, T6>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>,
  p5: ParserOrLiteral<T5>,
  p6: ParserOrLiteral<T6>
): Parser<T1 | T2 | T3 | T4 | T5 | T6>
export function or<T>(...parsers: ParserOrLiteral<T>[]): Parser<T>
export function or(...parsers: ParserOrLiteral<any>[]): Parser<any>

export function or(...parsers: ParserOrLiteral<any>[]) {
  const parsers_ = parsers.map(toParser)
  return new Parser((c, s, pos) => {
    for (let parser of parsers_) {
      const result = parser.parse(c, s, pos)
      if (result !== null) {
        return result
      }
    }
    return null
  })
}
