import { Parser, ParseResult } from "./types"

export default class ParserResolver {
  private mem: { [key: string]: Parser<any> } = {}
  add(name: string, parser: Parser<any>) {
    this.mem[name] = parser
  }
  get(name: string) {
    const result = this.mem[name]
    if (!result) {
      throw new Error(`parser ${name} is not found in this context`)
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
