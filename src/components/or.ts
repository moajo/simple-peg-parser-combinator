import { Parser } from "../types"

export const or = (...parsers: Parser[]) => (s: string) => {
  for (const parser of parsers) {
    const result = parser(s)
    if (result !== null) {
      return result
    }
  }
  return null
}
