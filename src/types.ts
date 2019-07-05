import { ParseContext } from "./context"

export type ParserIdentifier<T> = string | Parser<T>

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

  mapTo<U>(value: U): Parser<U> {
    return this.map(_ => value)
  }

  debug(message: string): Parser<T> {
    return new Parser((c, s) => {
      console.log("@debug: " + message)
      const res = this.parser(c, s)
      console.log(
        `@debug ${res ? "ok" : "ng"}: ` + message + (res ? res.value : "")
      )
      return res
    })
  }
  moredebug(message: string): Parser<T> {
    return new Parser((c, s) => {
      console.log("@debug: " + message)
      const res = this.parser(c, s)
      console.log(`@debug ${res ? "ok" : "ng"}: ` + message)
      return res
    })
  }
}

export class ClosedParser<T> {
  constructor(private parser: Parser<T>, private context: ParseContext) {}

  parse(s: string): ParseResult<T> | null {
    this.context.cache.clear()
    return this.parser.parse(this.context, s)
  }
}
