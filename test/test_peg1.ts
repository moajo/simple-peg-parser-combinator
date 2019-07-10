import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression, Rule } from "../src/peg/09.grammer"
import * as fs from "fs"
import { StringLiteral, LiteralMatcher } from "../src/peg/05.string"
import {
  SuffixedOperatorEnum,
  makeLiteralMatcherNode,
  makeAnyMatcherNode,
  makeRuleNode,
  makeActionExpressionNode,
  makeSuffixExpressionNode,
  makeCharacterNode,
  makeSequenceExpressionNode,
  makeRuleReferenceNode,
  makeCharacterClassMatcherExpressionNode,
  makeCharacterRangeNode,
  makeChoiceExpressionNode,
  makeLabeledExpressionNode,
  makeGrammerNode
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
    makeLiteralMatcherNode("hogehoge", false)
  )
  expect(LiteralMatcher.parse(pc, "'hogehoge'i")!.value).toStrictEqual(
    makeLiteralMatcherNode("hogehoge", true)
  )
})

describe("matchers", () => {
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
        makeAnyMatcherNode()
      )
    })
  })

  describe("RuleReferenceExpression", () => {
    test("RuleReferenceExpression", () => {
      const pc = new ParseContext(new ParserCache(), new ParserResolver())
      expect(RuleReferenceExpression.parse(pc, "hoge")!.value).toStrictEqual(
        makeRuleReferenceNode("hoge")
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

const rule_whitespace = makeRuleNode(
  "_",
  makeSuffixExpressionNode(
    SuffixedOperatorEnum.ZERO_OR_MORE,
    makeCharacterClassMatcherExpressionNode(false, false, [
      makeCharacterNode(" "),
      makeCharacterNode("\t"),
      makeCharacterNode("\n"),
      makeCharacterNode("\r")
    ])
  ),
  "whitespace"
)
const rule_integer = makeRuleNode(
  "Integer",
  makeActionExpressionNode(
    makeSequenceExpressionNode([
      makeRuleReferenceNode("_"),
      makeSuffixExpressionNode(
        SuffixedOperatorEnum.ONE_OR_MORE,
        makeCharacterClassMatcherExpressionNode(false, false, [
          makeCharacterRangeNode("0", "9")
        ])
      )
    ]),
    " return parseInt(text(), 10); "
  ),
  "integer"
)
const rule_factor = makeRuleNode(
  "Factor",
  makeChoiceExpressionNode([
    makeSequenceExpressionNode([
      makeLiteralMatcherNode("(", false),
      makeRuleReferenceNode("_"),
      makeLabeledExpressionNode(true, "", makeRuleReferenceNode("Expression")),
      makeRuleReferenceNode("_"),
      makeLiteralMatcherNode(")", false)
    ]),
    makeRuleReferenceNode("Integer")
  ])
)
const rule_term = makeRuleNode(
  "Term",
  makeActionExpressionNode(
    makeSequenceExpressionNode([
      makeLabeledExpressionNode(false, "head", makeRuleReferenceNode("Factor")),
      makeLabeledExpressionNode(
        false,
        "tail",
        makeSuffixExpressionNode(
          SuffixedOperatorEnum.ZERO_OR_MORE,
          makeSequenceExpressionNode([
            makeRuleReferenceNode("_"),
            makeLabeledExpressionNode(
              true,
              "",
              makeChoiceExpressionNode([
                makeLiteralMatcherNode("*", false),
                makeLiteralMatcherNode("/", false)
              ])
            ),
            makeRuleReferenceNode("_"),
            makeLabeledExpressionNode(true, "", makeRuleReferenceNode("Factor"))
          ])
        )
      )
    ]),
    String.raw`
      return tail.reduce(function(result, element) {
        if (element[0] === "*") return result * element[1];
        if (element[0] === "/") return result / element[1];
      }, head);
    `
  )
)

const rule_expression = makeRuleNode(
  "Expression",
  makeActionExpressionNode(
    makeSequenceExpressionNode([
      makeLabeledExpressionNode(false, "head", makeRuleReferenceNode("Term")),
      makeLabeledExpressionNode(
        false,
        "tail",
        makeSuffixExpressionNode(
          SuffixedOperatorEnum.ZERO_OR_MORE,
          makeSequenceExpressionNode([
            makeRuleReferenceNode("_"),
            makeLabeledExpressionNode(
              true,
              "",
              makeChoiceExpressionNode([
                makeLiteralMatcherNode("+", false),
                makeLiteralMatcherNode("-", false)
              ])
            ),
            makeRuleReferenceNode("_"),
            makeLabeledExpressionNode(true, "", makeRuleReferenceNode("Term"))
          ])
        )
      )
    ]),
    String.raw`
      return tail.reduce(function(result, element) {
        if (element[0] === "+") return result + element[1];
        if (element[0] === "-") return result - element[1];
      }, head);
    `
  )
)

const rule_grammer = makeGrammerNode([
  rule_expression,
  rule_term,
  rule_factor,
  rule_integer,
  rule_whitespace
])

describe("rule", () => {
  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)

  test("whitespace", () => {
    const pc = new ParseContext(new ParserCache(), pr)
    const input = String.raw`_ "whitespace"  = [ \t\n\r]*`
    expect(Rule.parse(pc, input)!.value).toStrictEqual(rule_whitespace)
  })

  test("integar", () => {
    const pc = new ParseContext(new ParserCache(), pr)
    const input = String.raw`Integer "integer"
    = _ [0-9]+ { return parseInt(text(), 10); }`
    expect(Rule.parse(pc, input)!.value).toStrictEqual(rule_integer)
  })
  test("factor", () => {
    const pc = new ParseContext(new ParserCache(), pr)
    const input = String.raw`Factor
    = "(" _ @Expression _ ")"
    / Integer`
    expect(Rule.parse(pc, input)!.value).toStrictEqual(rule_factor)
  })
  test("term", () => {
    const pc = new ParseContext(new ParserCache(), pr)
    const input = String.raw`Term
  = head:Factor tail:(_ @("*" / "/") _ @Factor)* {
      return tail.reduce(function(result, element) {
        if (element[0] === "*") return result * element[1];
        if (element[0] === "/") return result / element[1];
      }, head);
    }`
    expect(Rule.parse(pc, input)!.value).toStrictEqual(rule_term)
  })
  test("expression", () => {
    const pc = new ParseContext(new ParserCache(), pr)
    const input = String.raw`Expression
  = head:Term tail:(_ @("+" / "-") _ @Term)* {
      return tail.reduce(function(result, element) {
        if (element[0] === "+") return result + element[1];
        if (element[0] === "-") return result - element[1];
      }, head);
    }`
    expect(Rule.parse(pc, input)!.value).toStrictEqual(rule_expression)
  })
})

test("grammar", () => {
  const pr = new ParserResolver()
  const pc = new ParseContext(new ParserCache(), pr)
  pr.add("Expression", Expression)
  pr.add("Code", Code)
  expect(Grammar.parse(pc, arithmetics_src)!.value).toStrictEqual(rule_grammer)
})
