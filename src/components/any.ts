import { Parser } from "../types"

/**
 * 任意の1文字にマッチ
 */
export const anyChar = new Parser((_, s, pos) => {
  if (s.length != pos) {
    return {
      length: 1,
      value: s[pos]
    }
  }
  return null
})
