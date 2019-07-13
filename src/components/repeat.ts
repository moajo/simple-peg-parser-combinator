import { Parser, ParserIdentifier } from "../types"
import { resolveParser } from "../utils"

export const repeat = <T>(parserId: ParserIdentifier<T>, minCount: number) =>
  new Parser((pc, s, pos) => {
    let c = 0
    let total = 0
    let values: T[] = []
    while (true) {
      const result = resolveParser(parserId, pc.resolver).parse(pc, s, pos)
      if (result === null) {
        break
      }
      total += result.length
      values.push(result.value)
      c += 1
      pos += result.length
    }
    if (c < minCount) {
      return null
    }
    return {
      length: total,
      value: values
    }
  })

// 1 or more
export const repeat1 = <T>(parser: ParserIdentifier<T>) => repeat(parser, 1)

// 0 or more
export const repeat0 = <T>(parser: ParserIdentifier<T>) => repeat(parser, 0)

export const zeroOrOne = <T>(parser: ParserIdentifier<T>) =>
  new Parser((pc, s, pos) => {
    const result = resolveParser(parser, pc.resolver).parse(pc, s, pos)
    if (result) {
      return result
    } else {
      return {
        length: 0,
        value: null
      }
    }
  })
