import { Parser } from "../types"

/**
 * 肯定先読み
 * @param parser
 */
export const andPredicate = <T>(parser: Parser<T>) =>
  new Parser((c, s, pos) => {
    const predict = parser.parse(c, s, pos)
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
export const notPredicate = <T>(parser: Parser<T>) =>
  new Parser((c, s, pos) => {
    const predict = parser.parse(c, s, pos)
    if (!predict) {
      return {
        length: 0,
        value: ""
      }
    }
    return null
  })
