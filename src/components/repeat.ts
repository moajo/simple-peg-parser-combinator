import { Parser } from "../types"

export const repeat = (parser: Parser, minCount: number) => (s: string) => {
  let c = 0
  let total = 0
  while (true) {
    const result = parser(s)
    if (result === null) {
      break
    }
    total += result
    c += 1
    s = s.substr(result)
  }
  if (c < minCount) {
    return null
  }
  return total
}

// 1 or more
export const repeat1 = (parser: Parser) => repeat(parser, 1)

// 0 or more
export const repeat0 = (parser: Parser) => repeat(parser, 0)
