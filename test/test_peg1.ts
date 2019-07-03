import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { Grammar } from "../src/peg/09.grammer"
import * as fs from "fs"
import { StringLiteral, LiteralMatcher } from "../src/peg/05.string"
import { LiteralMatcherNode } from "../src/peg/ast"

const arithmetics_src = fs.readFileSync("./peg/arithmetics.pegjs", {
  encoding: "utf8"
})

test("string literal", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(StringLiteral.parse(pc, '"hogehoge"')!.value).toBe("hogehoge")
  expect(StringLiteral.parse(pc, "'hogehoge'")!.value).toBe("hogehoge")
  expect(LiteralMatcher.parse(pc, "'hogehoge'")!.value).toStrictEqual(
    new LiteralMatcherNode("hogehoge", false)
  )
  expect(LiteralMatcher.parse(pc, "'hogehoge'i")!.value).toStrictEqual(
    new LiteralMatcherNode("hogehoge", true)
  )
})

test.skip("grammar", () => {
  const pc = new ParseContext(new ParserCache(), new ParserResolver())
  expect(Grammar.parse(pc, arithmetics_src)!.length).toBe("hoge".length)
  // expect(Grammar.parse(pc, "hogea")!.length).toBe("hoge".length)
  // expect(Grammar.parse(pc, "fuga")).toBe(null)
})
