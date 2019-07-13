import { Parser, ParserOrLiteral } from "../types"
import { toParser } from "../utils"

/**
 * 連続したパターンにマッチ
 * @param p1
 */
export function sequence<T>(p1: ParserOrLiteral<T>): Parser<[T]>
export function sequence<T1, T2>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>
): Parser<[T1, T2]>
export function sequence<T1, T2, T3>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>
): Parser<[T1, T2, T3]>
export function sequence<T1, T2, T3, T4>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>
): Parser<[T1, T2, T3, T4]>
export function sequence<T1, T2, T3, T4, T5>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>,
  p5: ParserOrLiteral<T5>
): Parser<[T1, T2, T3, T4, T5]>
export function sequence<T1, T2, T3, T4, T5, T6>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>,
  p5: ParserOrLiteral<T5>,
  p6: ParserOrLiteral<T6>
): Parser<[T1, T2, T3, T4, T5, T6]>
export function sequence<T1, T2, T3, T4, T5, T6, T7>(
  p1: ParserOrLiteral<T1>,
  p2: ParserOrLiteral<T2>,
  p3: ParserOrLiteral<T3>,
  p4: ParserOrLiteral<T4>,
  p5: ParserOrLiteral<T5>,
  p6: ParserOrLiteral<T6>,
  p7: ParserOrLiteral<T7>
): Parser<[T1, T2, T3, T4, T5, T6, T7]>

export function sequence<T>(...parsers: ParserOrLiteral<T>[]): Parser<T[]>
export function sequence(...parsers: ParserOrLiteral<any>[]): Parser<any[]>
export function sequence(...parsers: ParserOrLiteral<any>[]) {
  const parsers_ = parsers.map(toParser)
  return new Parser((pc, s, pos) => {
    let total = 0
    let values = []
    for (let parser of parsers_) {
      const result = parser.parse(pc, s, pos)
      if (result === null) {
        return null
      }
      total += result.length
      values.push(result.value)
      pos += result.length
    }
    return {
      length: total,
      value: values
    }
  })
}
