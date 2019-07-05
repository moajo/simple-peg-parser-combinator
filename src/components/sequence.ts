import { Parser, ParseResult, ParserIdentifier } from "../types"
import { resolveParser } from "../utils"

export function sequence<T>(p1: ParserIdentifier<T>): Parser<[T]>
export function sequence<T1, T2>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>
): Parser<[T1, T2]>
export function sequence<T1, T2, T3>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>
): Parser<[T1, T2, T3]>
export function sequence<T1, T2, T3, T4>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>
): Parser<[T1, T2, T3, T4]>
export function sequence<T1, T2, T3, T4, T5>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>,
  p5: ParserIdentifier<T5>
): Parser<[T1, T2, T3, T4, T5]>
export function sequence<T1, T2, T3, T4, T5, T6>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>,
  p5: ParserIdentifier<T5>,
  p6: ParserIdentifier<T6>
): Parser<[T1, T2, T3, T4, T5, T6]>
export function sequence<T1, T2, T3, T4, T5, T6, T7>(
  p1: ParserIdentifier<T1>,
  p2: ParserIdentifier<T2>,
  p3: ParserIdentifier<T3>,
  p4: ParserIdentifier<T4>,
  p5: ParserIdentifier<T5>,
  p6: ParserIdentifier<T6>,
  p7: ParserIdentifier<T7>
): Parser<[T1, T2, T3, T4, T5, T6, T7]>

export function sequence<T>(...parsers: ParserIdentifier<T>[]): Parser<T[]>
export function sequence(...parsers: ParserIdentifier<any>[]): Parser<any[]>
export function sequence(...parsers: ParserIdentifier<any>[]) {
  return new Parser((pc, s: string) => {
    let total = 0
    let values = []
    for (let parser of parsers) {
      const result = resolveParser(parser, pc.resolver).parse(pc, s)
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
}
