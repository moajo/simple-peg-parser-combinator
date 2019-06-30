export const literal = (text: string) => (s: string) => {
  if (s.startsWith(text)) {
    return text.length
  } else {
    return null
  }
}
