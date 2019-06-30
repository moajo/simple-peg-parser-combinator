export const literal = (text: string, mapper?: (value: string) => any) => (
  s: string
) => {
  if (s.startsWith(text)) {
    return {
      length: text.length,
      value: mapper ? mapper(text) : text
    }
  } else {
    return null
  }
}
