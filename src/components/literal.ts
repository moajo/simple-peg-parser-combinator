import { Parser } from "../types"

export const literal = (text: string, ignoreCase?: boolean) =>
  new Parser((_, s) => {
    if (ignoreCase) {
      s = s.toLowerCase()
      text = text.toLowerCase()
    }
    if (s.startsWith(text)) {
      return {
        length: text.length,
        value: text
      }
    }
    return null
  })
