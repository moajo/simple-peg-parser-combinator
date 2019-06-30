import { Parser } from "../types"

export const literal = (text: string) =>
  new Parser((s: string) => {
    if (s.startsWith(text)) {
      return {
        length: text.length,
        value: text
      }
    } else {
      return null
    }
  })
