import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { Grammar, Expression, Rule } from "../src/peg/09.grammer"
import * as fs from "fs"
import { StringLiteral, LiteralMatcher } from "../src/peg/05.string"
import {
  LiteralMatcherNode,
  AnyMatcherNode,
  RuleReferenceNode,
  GrammerNode,
  RuleNode,
  CharacterClassMatcherExpressionNode,
  CharactorNode,
  SuffixExpressionNode,
  SuffixedOperatorEnum,
  ActionExpressionNode,
  SequenceExpressionNode,
  CharactorRangeNode,
  ChoiceExpressionNode,
  LabeledExpressionNode
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

const rule_whitespace = new RuleNode(
  "_",
  new SuffixExpressionNode(
    SuffixedOperatorEnum.ZERO_OR_MORE,
    new CharacterClassMatcherExpressionNode(false, false, [
      new CharactorNode(" "),
      new CharactorNode("\t"),
      new CharactorNode("\n"),
      new CharactorNode("\r")
    ])
  ),
  "whitespace"
)
const rule_integer = new RuleNode(
  "Integer",
  new ActionExpressionNode(
    new SequenceExpressionNode([
      new RuleReferenceNode("_"),
      new SuffixExpressionNode(
        SuffixedOperatorEnum.ONE_OR_MORE,
        new CharacterClassMatcherExpressionNode(false, false, [
          new CharactorRangeNode("0", "9")
        ])
      )
    ]),
    " return parseInt(text(), 10); "
  ),
  "integer"
)
const rule_factor = new RuleNode(
  "Factor",
  new ChoiceExpressionNode([
    new SequenceExpressionNode([
      new LiteralMatcherNode("(", false),
      new RuleReferenceNode("_"),
      new LabeledExpressionNode(true, "", new RuleReferenceNode("Expression")),
      new RuleReferenceNode("_"),
      new LiteralMatcherNode(")", false)
    ]),
    new RuleReferenceNode("Integer")
  ])
)
const rule_term = new RuleNode(
  "Term",
  new ActionExpressionNode(
    new SequenceExpressionNode([
      new LabeledExpressionNode(false, "head", new RuleReferenceNode("Factor")),
      new LabeledExpressionNode(
        false,
        "tail",
        new SuffixExpressionNode(
          SuffixedOperatorEnum.ZERO_OR_MORE,
          new SequenceExpressionNode([
            new RuleReferenceNode("_"),
            new LabeledExpressionNode(
              true,
              "",
              new ChoiceExpressionNode([
                new LiteralMatcherNode("*", false),
                new LiteralMatcherNode("/", false)
              ])
            ),
            new RuleReferenceNode("_"),
            new LabeledExpressionNode(true, "", new RuleReferenceNode("Factor"))
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

const rule_expression = new RuleNode(
  "Expression",
  new ActionExpressionNode(
    new SequenceExpressionNode([
      new LabeledExpressionNode(false, "head", new RuleReferenceNode("Term")),
      new LabeledExpressionNode(
        false,
        "tail",
        new SuffixExpressionNode(
          SuffixedOperatorEnum.ZERO_OR_MORE,
          new SequenceExpressionNode([
            new RuleReferenceNode("_"),
            new LabeledExpressionNode(
              true,
              "",
              new ChoiceExpressionNode([
                new LiteralMatcherNode("+", false),
                new LiteralMatcherNode("-", false)
              ])
            ),
            new RuleReferenceNode("_"),
            new LabeledExpressionNode(true, "", new RuleReferenceNode("Term"))
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

test.skip("grammar", () => {
  // const rule_expression = new RuleNode("Expression", new ExpressionNode())
  // const rule_term = new RuleNode("Term", new ExpressionNode())
  // const rule_factor = new RuleNode("Factor", new ExpressionNode())
  // const rule_integer = new RuleNode("Integer", new ExpressionNode(), "integer")
  // const rule_whitespace = new RuleNode(
  //   "_",
  //   new ZeroOrMoreExpressionNode(
  //     new CharacterClassMatcherExpressionNode([" ", "\t", "\n", "\r"])
  //   ),
  //   "whitespace"
  // )

  const pr = new ParserResolver()
  pr.add("Expression", Expression)
  pr.add("Code", Code)
  const pc = new ParseContext(new ParserCache(), pr)
  expect(Grammar.parse(pc, arithmetics_src)!).toStrictEqual(new GrammerNode([]))
  // expect(Grammar.parse(pc, "hogea")!.length).toBe("hoge".length)
  // expect(Grammar.parse(pc, "fuga")).toBe(null)
})
