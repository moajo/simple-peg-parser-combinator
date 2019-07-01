import { Parser } from "./types"

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
