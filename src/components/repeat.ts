import { Parser } from "../types"
import ParserContext from "../context"
import { ParseResult } from "../types"

export const repeat = (parser: Parser<any>, minCount: number) =>
  new Parser((s: string) => {
    let c = 0
    let total = 0
    let values = []
    while (true) {
      const result = parser.parse(s)
      if (result === null) {
        break
      }
      total += result.length
      values.push(result.value)
      c += 1
      s = s.substr(result.length)
    }
    if (c < minCount) {
      return null
    }
    return {
      length: total,
      value: values
    } as ParseResult<any[]>
  })
export const repeatRuntime = (
  context: ParserContext,
  parserName: string,
  minCount: number
) =>
  new Parser((s: string) => {
    let c = 0
    let total = 0
    let values = []
    while (true) {
      const result = context.get(parserName).parse(s)
      if (result === null) {
        break
      }
      total += result.length
      values.push(result.value)
      c += 1
      s = s.substr(result.length)
    }
    if (c < minCount) {
      return null
    }
    return {
      length: total,
      value: values
    } as ParseResult<any[]>
  })

// 1 or more
export const repeat1 = (parser: Parser<any>) => repeat(parser, 1)

// 0 or more
export const repeat0 = (parser: Parser<any>) => repeat(parser, 0)

// 1 or more
export const repeat1Runtime = (c: ParserContext, parserName: string) =>
  repeatRuntime(c, parserName, 1)

// 0 or more
export const repeat0Runtime = (c: ParserContext, parserName: string) =>
  repeatRuntime(c, parserName, 0)

export const zeroOrOne = (context: ParserContext, parserName: string) =>
  new Parser((s: string) => {
    const result = context.get(parserName).parse(s)
    if (result) {
      return result
    } else {
      return {
        length: 0,
        value: null
      }
    }
  })
