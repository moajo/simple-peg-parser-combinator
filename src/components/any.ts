import { Parser } from "../types"

/**
 * 任意の1文字にマッチ
 */
export const anyChar = new Parser((_, s) => {
  if (s.length >= 1) {
    return {
      length: 1,
      value: s[0]
    }
  }
  return null
})
