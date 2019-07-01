import { Parser, ParserIdentifier } from "../types"
import { resolveParser } from "../utils"

/**
 * 肯定先読み
 * @param parser
 */
export const andPredicate = <T>(parser: ParserIdentifier<T>) =>
  new Parser((c, s) => {
    const predict = resolveParser(parser, c.resolver).parse(c, s)
    if (predict) {
      return {
        length: 0,
        value: ""
      }
    }
    return null
  })

/**
 * 否定先読み
 * @param parser
 */
export const notPredicate = <T>(parser: ParserIdentifier<T>) =>
  new Parser((c, s) => {
    const predict = resolveParser(parser, c.resolver).parse(c, s)
    if (!predict) {
      return {
        length: 0,
        value: ""
      }
    }
    return null
  })
