import { Parser } from "../types"

/**
 * 連続したパターンにマッチ
 * @param p1
 */
export function sequence<T>(p1: Parser<T>): Parser<[T]>
export function sequence<T1, T2>(
  p1: Parser<T1>,
  p2: Parser<T2>
): Parser<[T1, T2]>
export function sequence<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<[T1, T2, T3]>
export function sequence<T1, T2, T3, T4>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>
): Parser<[T1, T2, T3, T4]>
export function sequence<T1, T2, T3, T4, T5>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>
): Parser<[T1, T2, T3, T4, T5]>
export function sequence<T1, T2, T3, T4, T5, T6>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>
): Parser<[T1, T2, T3, T4, T5, T6]>
export function sequence<T1, T2, T3, T4, T5, T6, T7>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>
): Parser<[T1, T2, T3, T4, T5, T6, T7]>

export function sequence<T>(...parsers: Parser<T>[]): Parser<T[]>
export function sequence(...parsers: Parser<any>[]): Parser<any[]>
export function sequence(...parsers: Parser<any>[]) {
  return new Parser((pc, s, pos) => {
    let total = 0
    let values = []
    for (let parser of parsers) {
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
