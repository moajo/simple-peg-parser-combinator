import { or } from "./or"
import { literal } from "./literal"
import { repeat0 } from "./repeat"
import { Parser } from "../types"

/**
 * match any single character that appears in the given string
 * @param charactors
 */
export const anyCharactorOf = (charactors: string) =>
  or(...Array.from(charactors).map(literal))

export const whitespace = repeat0(anyCharactorOf(" \t\n\r")).map(it =>
  it.join("")
)

/**
 * end of file
 */
export const EOF = new Parser((_, s) => {
  if (s.length == 0) {
    return {
      length: 0,
      value: ""
    }
  }
  return null
})

/**
 * match any single character between startChar and endChar
 * (INCLUDE startChar,endChar)
 * @param startChar
 * @param endChar
 */
export const between = (startChar: string, endChar: string) => {
  const betweenChars: string[] = []
  const end = endChar.codePointAt(0)!
  for (let i = startChar.codePointAt(0)!; i <= end; ++i) {
    betweenChars.push(String.fromCodePoint(i))
  }
  return anyCharactorOf(betweenChars.join(""))
}
