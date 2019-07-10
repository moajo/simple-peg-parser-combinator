import { repeat0 } from "./repeat"
import { Parser, ParserIdentifier } from "../types"
import { resolveParser } from "../utils"

/**
 * match any single character that appears in the given string
 * @param characters
 */
export const anyCharacterOf = (characters: string, ignoreCase?: boolean) =>
  new Parser((_, s) => {
    if (ignoreCase) {
      s = s.toLowerCase()
      characters = characters.toLowerCase()
    }
    return characters.includes(s[0])
      ? {
          length: 1,
          value: s[0]
        }
      : null
  })

export const whitespace = repeat0(anyCharacterOf(" \t\n\r")).map(it =>
  it.join("")
)

/**
 * end of file
 */
export const EOF = new Parser((_, s) => {
  return s.length == 0
    ? {
        length: 0,
        value: ""
      }
    : null
})

/**
 * match any single character between startChar and endChar
 * (INCLUDE startChar,endChar)
 * @param startChar
 * @param endChar
 */
export const between = (
  startChar: string,
  endChar: string,
  ignoreCase?: boolean
) => {
  const start = startChar.codePointAt(0)!
  const end = endChar.codePointAt(0)!
  return new Parser((_, s) => {
    if (s.length >= 1) {
      const codePoint = (ignoreCase ? s[0].toLowerCase() : s).codePointAt(0)!
      if (start <= codePoint && codePoint <= end) {
        return { length: 1, value: s[0] }
      }
    }
    return null
  })
}

export const ref = <T>(id: ParserIdentifier<T>) =>
  new Parser<T>((c, s) => {
    return resolveParser<T>(id, c.resolver).parse(c, s)
  })
