import { ParseContext } from "./context"

export type ParseResult<T> = {
  /**
   * マッチした長さ
   */
  length: number
  /**
   * マッチした値
   */
  value: T
}

/**
 * コンビネータ基底
 * コンストラクタで受け取った本体の処理に対して、キャッシュを適用する(packrat)
 * ついでにutilityを生やしてある
 */
export class Parser<T> {
  constructor(
    /**
     * コンビネータ本体
     * コンテキストと現在の検査対象文字列を受け取り、マッチすればParseResult<T>を、そうでなければnullを返すことが期待される
     */
    private parser: (
      c: ParseContext,
      s: string,
      position: number
    ) => ParseResult<T> | null
  ) {}

  parse(c: ParseContext, s: string, position = 0): ParseResult<T> | null {
    return c.cache.cacheProxy(s, position, this, () =>
      this.parser(c, s, position)
    )
  }

  map<U>(mapper: (result: T) => U): Parser<U> {
    const p = this.parser
    return new Parser((c, s, pos) => {
      const res = p(c, s, pos)
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
    return new Parser((c, s, pos) => {
      console.log("@debug: " + message)
      const res = this.parser(c, s, pos)
      console.log(
        `@debug ${res ? "ok" : "ng"}: ` +
          message +
          (res ? JSON.stringify(res.value) : "")
      )
      return res
    })
  }
}

/**
 * Parser bound to a fixed resolver.
 */
export class ClosedParser<T> {
  constructor(private parser: Parser<T>, private context: ParseContext) {}

  parse(s: string): ParseResult<T> | null {
    this.context.cache.clear()
    return this.parser.parse(this.context, s, 0)
  }
}
