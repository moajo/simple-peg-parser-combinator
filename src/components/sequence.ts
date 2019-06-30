import { Parser } from "../types"

export const sequence = (...parsers: Parser[]) => (s: string) => {
  let total = 0
  for (const parser of parsers) {
    const result = parser(s)
    if (result === null) {
      return null
    }
    total += result
    s = s.substr(result)
  }
  return total
}
