import { Parser, ParseResult } from "./types"

export class ParserResolver {
  private mem: { [key: string]: Parser<any> } = {}
  add<T>(name: string, parser: Parser<T>): Parser<T> {
    this.mem[name] = parser
    return parser
  }
  get(name: string): Parser<any> {
    const result = this.mem[name]
    if (!result) {
      throw new Error(`parser ${name} is not found in this context`)
    }
    if (typeof result === "string") {
      return this.get(result)
    }
    return result
  }
}

export class ParserCache {
  private _memory: {
    [text: string]: {
      [position: number]: {
        parser: Parser<any>
        result: ParseResult<any> | null
      }[]
    }
  } = {}

  cache<T>(
    text: string,
    position: number,
    parser: Parser<T>,
    result: ParseResult<T> | null
  ) {
    if (!this._memory[text]) {
      this._memory[text] = {}
    }
    if (!this._memory[text][position]) {
      this._memory[text][position] = []
    }
    this._memory[text][position].push({
      parser,
      result
    })
  }

  get<T>(text: string, position: number, parser: Parser<T>) {
    if (!this._memory[text]) {
      return null
    }
    if (!this._memory[text][position]) {
      return null
    }
    const cache = this._memory[text][position].find(
      obj => obj.parser === parser
    )
    if (!cache) {
      return null
    }
    return cache.result
  }

  clear() {
    this._memory = {}
  }

  cacheProxy<T>(
    text: string,
    position: number,
    parser: Parser<T>,
    executor: () => ParseResult<T> | null
  ) {
    const cache = this.get(text, position, parser)
    if (cache) {
      return cache
    }
    const execResult = executor()
    this.cache(text, position, parser, execResult)
    return execResult
  }
}

export class ParseContext {
  constructor(public cache: ParserCache, public resolver: ParserResolver) {}
}
