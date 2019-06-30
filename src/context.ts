import { Parser } from "./types"

export default class ParserContext {
  private mem: { [key: string]: Parser } = {}
  add(name: string, parser: Parser) {
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
