import { ParseContext } from "./context"

export type ParseResult<T> = {
  length: number
  value: T
}

export class Parser<T> {
  constructor(
    private parser: (c: ParseContext, s: string) => ParseResult<T> | null
  ) {}
  parse(c: ParseContext, s: string): ParseResult<T> | null {
    return c.cache.cacheProxy(s, this, () => {
      return this.parser(c, s)
    })
  }

  map<U>(mapper: (result: T) => U): Parser<U> {
    const p = this.parser
    return new Parser((c, s) => {
      const res = p(c, s)
      return res
        ? {
            length: res.length,
            value: mapper(res.value)
          }
        : null
    })
  }
}
