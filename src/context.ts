import { Parser, ParseResult, ParserIdentifier } from "./types"

export class ParserResolver {
  private mem: { [key: string]: ParserIdentifier<any> } = {}
  add<T>(name: string, parser: ParserIdentifier<T>): ParserIdentifier<T> {
    this.mem[name] = parser
    return name
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
    [text: string]: { parser: Parser<any>; result: ParseResult<any> | null }[]
  } = {}

  cache<T>(text: string, parser: Parser<T>, result: ParseResult<T> | null) {
    if (!this._memory[text]) {
      this._memory[text] = []
    }
    this._memory[text].push({
      parser,
      result
    })
  }

  get<T>(text: string, parser: Parser<T>) {
    if (!this._memory[text]) {
      return null
    }
    const cache = this._memory[text].find(obj => obj.parser === parser)
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
    parser: Parser<T>,
    executor: () => ParseResult<T> | null
  ) {
    const cache = this.get(text, parser)
    if (cache) {
      return cache
    }
    const execResult = executor()
    this.cache(text, parser, execResult)
    return execResult
  }
}

export class ParseContext {
  constructor(public cache: ParserCache, public resolver: ParserResolver) {}
}
