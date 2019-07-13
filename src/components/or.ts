import { Parser } from "../types"

export function or<T>(p1: Parser<T>): Parser<T>
export function or<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1 | T2>
export function or<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<T1 | T2 | T3>
export function or<T1, T2, T3, T4>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>
): Parser<T1 | T2 | T3 | T4>
export function or<T1, T2, T3, T4, T5>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>
): Parser<T1 | T2 | T3 | T4 | T5>
export function or<T1, T2, T3, T4, T5, T6>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>
): Parser<T1 | T2 | T3 | T4 | T5 | T6>
export function or<T>(...parsers: Parser<T>[]): Parser<T>
export function or(...parsers: Parser<any>[]): Parser<any>

export function or(...parsers: Parser<any>[]) {
  return new Parser((c, s, pos) => {
    for (let parser of parsers) {
      const result = parser.parse(c, s, pos)
      if (result !== null) {
        return result
      }
    }
    return null
  })
}
