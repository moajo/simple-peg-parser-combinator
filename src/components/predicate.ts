import { Parser, ParserOrLiteral } from "../types"
import { toParser } from "../utils"

/**
 * 肯定先読み
 * @param parser
 */
export const andPredicate = <T>(parser: ParserOrLiteral<T>) =>
  new Parser((c, s, pos) => {
    const predict = toParser(parser).parse(c, s, pos)
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
export const notPredicate = <T>(parser: ParserOrLiteral<T>) =>
  new Parser((c, s, pos) => {
    const predict = toParser(parser).parse(c, s, pos)
    if (!predict) {
      return {
        length: 0,
        value: ""
      }
    }
    return null
  })
