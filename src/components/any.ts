import { Parser } from "../types"

export const anyChar = new Parser((_, s) => {
  if (s.length >= 1) {
    return {
      length: 1,
      value: s[0]
    }
  }
  return null
})
