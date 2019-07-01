import { Parser } from "../types"

export const literal = (text: string) =>
  new Parser((_, s) => {
    if (s.startsWith(text)) {
      return {
        length: text.length,
        value: text
      }
    }
    return null
  })
