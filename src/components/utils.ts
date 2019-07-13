import { repeat0 } from "./repeat"
import { Parser } from "../types"
import { resolveParser } from "../utils"

/**
 * match any single character that appears in the given string
 * @param characters
 */
export const anyCharacterOf = (characters: string, ignoreCase?: boolean) =>
  new Parser((_, s, pos) => {
    if (ignoreCase) {
      s = s.toLowerCase()
      characters = characters.toLowerCase()
    }
    return characters.includes(s[pos])
      ? {
          length: 1,
          value: s[pos]
        }
      : null
  })

export const whitespace = repeat0(anyCharacterOf(" \t\n\r")).map(it =>
  it.join("")
)

/**
 * end of file
 */
export const EOF = new Parser((_, s, pos) => {
  return s.length == pos
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
  return new Parser((_, s, pos) => {
    if (s.length != pos) {
      const codePoint = (ignoreCase
        ? s[pos].toLowerCase()
        : s[pos]
      ).codePointAt(0)!
      if (start <= codePoint && codePoint <= end) {
        return { length: 1, value: s[pos] }
      }
    }
    return null
  })
}

export const ref = <T>(id: string) =>
  new Parser<T>((c, s, pos) =>
    resolveParser<T>(id, c.resolver).parse(c, s, pos)
  )
