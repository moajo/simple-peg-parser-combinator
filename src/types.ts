export type Parser<T> = (s: string) => ParseResult<T> | null
export type ParseResult<T> = {
  length: number
  value: T
}
