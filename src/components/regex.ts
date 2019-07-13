import { Parser } from "../types"

export const regex = (pattern: RegExp) =>
  new Parser((_, s, pos) => {
    const m = pattern.exec(s.substr(pos))
    if (m && m.index === 0) {
      const matchString = m[0]
      return {
        length: matchString.length,
        value: matchString
      }
    }
    return null
  })
