import { Parser } from "../types"

/**
 * 文字列リテラルにマッチ
 * @param text
 * @param ignoreCase
 */
export const literal = (text: string, ignoreCase?: boolean) => {
  if (ignoreCase) {
    text = text.toLowerCase()
  }
  return new Parser(
    (_, s, pos) => {
      if (ignoreCase) {
        s = s.toLowerCase()
      }

      if (s.startsWith(text, pos)) {
        return {
          length: text.length,
          value: text
        }
      }
      return null
    },
    () => text
  )
}
