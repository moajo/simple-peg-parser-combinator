import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression } from "../src/peg/09.grammer"
import * as fs from "fs"
import { StringLiteral, LiteralMatcher } from "../src/peg/05.string"
import {
  LiteralMatcherNode,
  AnyMatcherNode,
  RuleReferenceNode
} from "../src/peg/ast"
import {
  PrimaryExpression,
  RuleReferenceExpression,
  SemanticPredicateExpression
} from "../src/peg/08.primaryExpression"
import { CharacterClassMatcher, AnyMatcher } from "../src/peg/05.matcher"
import { Code } from "../src/peg/01.1.codeblock"

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

describe.skip("matchers", () => {
  describe("CharacterClassMatcher", () => {
    test("CharacterClassMatcher", () => {
      const pc = new ParseContext(new ParserCache(), new ParserResolver())
      expect(CharacterClassMatcher.parse(pc, "[a-z]")).not.toBe(null)
    })
  })

  describe("AnyMatcher", () => {
    test("AnyMatcher", () => {
      const pc = new ParseContext(new ParserCache(), new ParserResolver())
      expect(AnyMatcher.parse(pc, ".")!.value).toStrictEqual(
        new AnyMatcherNode()
      )
    })
  })

  describe("RuleReferenceExpression", () => {
    test("RuleReferenceExpression", () => {
      const pc = new ParseContext(new ParserCache(), new ParserResolver())
      expect(RuleReferenceExpression.parse(pc, "hoge")!.value).toStrictEqual(
        new RuleReferenceNode("hoge")
      )
    })
  })

  describe("SemanticPredicateExpression", () => {
    test("SemanticPredicateExpression", () => {
      const pc = new ParseContext(new ParserCache(), new ParserResolver())
      expect(SemanticPredicateExpression.parse(pc, "!{}")).not.toBe(null)
      expect(SemanticPredicateExpression.parse(pc, "&{}")).not.toBe(null)
    })
  })
})

describe("PrimaryExpression", () => {
  test("PrimaryExpression", () => {
    const pc = new ParseContext(new ParserCache(), new ParserResolver())
    expect(PrimaryExpression.parse(pc, "'hoge'")).not.toBe(null)
    expect(PrimaryExpression.parse(pc, "[0-9]")).not.toBe(null)
    expect(PrimaryExpression.parse(pc, ".")).not.toBe(null)
    expect(PrimaryExpression.parse(pc, "hoge")).not.toBe(null)
  })
})

test("grammar", () => {
  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)
  const pc = new ParseContext(new ParserCache(), pr)
  expect(Grammar.parse(pc, arithmetics_src)!).not.toBe(null)
  // expect(Grammar.parse(pc, "hogea")!.length).toBe("hoge".length)
  // expect(Grammar.parse(pc, "fuga")).toBe(null)
})
