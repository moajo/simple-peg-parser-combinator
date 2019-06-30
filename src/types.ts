export type ParseResult<T> = {
  length: number
  value: T
}

export class Parser<T> {
  constructor(private parser: (s: string) => ParseResult<T> | null) {}
  parse(s: string): ParseResult<T> | null {
    return this.parser(s)
  }

  map<U>(mapper: (result: T) => U): Parser<U> {
    const p = this.parser
    return new Parser(s => {
      const res = p(s)
      return res
        ? {
            length: res.length,
            value: mapper(res.value)
          }
        : null
    })
  }
}
