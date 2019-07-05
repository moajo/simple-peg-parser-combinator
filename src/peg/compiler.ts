import { Parser, ClosedParser } from "../types"
import {
  GrammerNode,
  ExpressionNode,
  CharacterPart,
  PrefixedOperatorEnum,
  SuffixedOperatorEnum
} from "./ast"
import ParserResolver, { ParseContext, ParserCache } from "../context"
import { resolveParser } from "../utils"
import { or, sequence } from ".."
import { literal } from "../components/literal"
import { notPredicate } from "../components/predicate"
import { between } from "../components/utils"
import { zeroOrOne, repeat0, repeat1 } from "../components/repeat"

const ref = <T>(id: string) =>
  new Parser<T>((c, s) => {
    return resolveParser<T>(id, c.resolver).parse(c, s)
  })

type PegParseResult = {
  atmark: boolean
  label: string
  matchString: string
  value: any
}

//   const toPegParseResult = (result:any)=>({
//     atmark: false,
//     label: "",
//     matchString: string,
//     value: result
//   })

const _compileCharacterPart: (
  c: CharacterPart,
  ignoreCase: boolean
) => Parser<PegParseResult> = (c: CharacterPart, ignoreCase: boolean) => {
  switch (c.type) {
    case "Charactor":
      return literal(c.char, ignoreCase).map(res => ({
        atmark: false,
        label: "",
        matchString: res,
        value: res
      }))
    case "CharactorRange":
      return between(c.charStart, c.charEnd, ignoreCase).map(res => ({
        atmark: false,
        label: "",
        matchString: res,
        value: res
      }))
  }
  throw new Error("not")
}

const _compileExpression: (
  expressionNode: ExpressionNode
) => Parser<PegParseResult> = (expressionNode: ExpressionNode) => {
  switch (expressionNode.type) {
    case "RuleReference":
      return ref<PegParseResult>(expressionNode.ruleName).debug(
        "ref:" + expressionNode.ruleName
      )
    case "SequenceExpression":
      return sequence(...expressionNode.children.map(_compileExpression))
        .map(res => {
          const atmarks = res.filter(a => a.atmark)
          if (atmarks.length !== 0) {
            res = atmarks
            return {
              atmark: false,
              label: "",
              matchString: res.map(a => a.matchString).reduce((p, c) => p + c),
              value: res.map(a => a.value)
            }
          }
          const labeled = res.filter(a => a.label !== "")
          if (labeled.length !== 0) {
            res = labeled
            console.log("@@@@@@@@@@@@@labeledlisrt", labeled)
            let aa: { [k: string]: any } = {}
            labeled.forEach(a => {
              aa[a.label] = a.value
            })

            return {
              atmark: false,
              label: "",
              matchString: res.map(a => a.matchString).reduce((p, c) => p + c),
              value: aa
            }
          }
          return {
            atmark: false,
            label: "",
            matchString: res.map(a => a.matchString).reduce((p, c) => p + c),
            value: res.map(a => a.value)
          }
        })
        .debug("seq")
    case "ChoiceExpression":
      return or(...expressionNode.children.map(_compileExpression)).debug(
        "choice"
      )
    case "ActionExpression":
      return _compileExpression(expressionNode.child)
        .map(result => {
          console.log("action ok!:", JSON.stringify(result))
          console.log("action ok!:", "@@@" + expressionNode.actionCode + "@@@")
          const argumentlist: [string, any][] = [
            ["text", () => result.matchString]
          ]
          if (Array.isArray(result.value)) {
          } else {
            const labeled = result.value as { [k: string]: any }
            console.log("action ok-labels:", JSON.stringify(labeled))
            Object.keys(labeled).forEach(key => {
              argumentlist.push([key, labeled[key]])
            })
          }
          const argkeys = argumentlist.map(a => a[0])
          const argvalues = argumentlist.map(a => a[1])
          console.log("action ok-keys:", argkeys)
          const f = Function(...argkeys, expressionNode.actionCode)
          const v = f(...argvalues)
          console.log("action ffff!:", "@@@" + v + "@@@")
          return {
            atmark: false,
            label: "",
            matchString: result.matchString,
            value: v
          }
        })
        .debug("action")
    case "CharacterClassMatcherExpression":
      const rr = expressionNode.targets.map(a =>
        _compileCharacterPart(a, expressionNode.ignoreCase)
      )
      const rrr = or(...rr)
      return expressionNode.inverted
        ? notPredicate(rrr)
            .map(
              _ =>
                ({
                  atmark: false,
                  label: "",
                  matchString: "",
                  value: ""
                } as PegParseResult)
            )
            .debug("inverted []")
        : rrr.debug("[]")
    case "LabeledExpression":
      const exp = _compileExpression(expressionNode.expression)
      if (expressionNode.atmark) {
        return exp
          .map(result => {
            return {
              atmark: true,
              label: "",
              matchString: result.matchString,
              value: result.value
            }
          })
          .debug("atmarkkkkkkkk")
      } else {
        return exp
          .map(result => {
            return {
              atmark: false,
              label: expressionNode.label,
              matchString: result.matchString,
              value: result.value
            }
          })
          .debug("labellllll:" + expressionNode.label)
      }
    case "LiteralMatcher":
      return literal(expressionNode.str, expressionNode.ignoreCase).map(
        res =>
          ({
            atmark: false,
            label: "",
            matchString: res,
            value: res
          } as PegParseResult)
      )
    case "PrefixExpression":
      const exp2 = _compileExpression(expressionNode.expression).debug("pre")
      switch (expressionNode.prefixOperator) {
        case PrefixedOperatorEnum.TEXT:
          return exp2.map(
            res =>
              ({
                ...res,
                value: res.matchString
              } as PegParseResult)
          )
          break
        case PrefixedOperatorEnum.SIMPLE_AND:
          return exp2
        case PrefixedOperatorEnum.SIMPLE_NOT:
          return notPredicate(exp2).map(
            _ =>
              ({
                atmark: false,
                label: "",
                matchString: "",
                value: ""
              } as PegParseResult)
          )
      }
      throw new Error("aaaaa")
    case "SuffixExpression":
      console.log("@@@@@@@@@@@@@", expressionNode.expression.type)
      const exp3 = _compileExpression(expressionNode.expression).debug("suff")
      switch (expressionNode.suffixOperator) {
        case SuffixedOperatorEnum.OPTIONAL:
          return zeroOrOne(exp3).map(res => {
            if (res) {
              return res
            }
            return {
              atmark: false,
              label: "",
              matchString: "",
              value: ""
            }
          })
        case SuffixedOperatorEnum.ZERO_OR_MORE:
          return repeat0(exp3)
            .map(res => {
              return {
                atmark: false,
                label: "",
                matchString: res
                  .map(a => a.matchString)
                  .reduce((p, c) => p + c, ""),
                value: res.map(a => a.value)
              } as PegParseResult
            })
            .debug("*")
        case SuffixedOperatorEnum.ONE_OR_MORE:
          return repeat1(exp3).map(res => {
            return {
              atmark: false,
              label: "",
              matchString: res.map(a => a.matchString).reduce((p, c) => p + c),
              value: res.map(a => a.value)
            } as PegParseResult
          })
      }
      throw new Error("aaaaa")
  }
}

export const compile: (ast: GrammerNode) => ClosedParser<any> = ast => {
  const { initCode, rules } = ast

  const resolver = new ParserResolver()
  const compiledRules = rules.map(ruleNode => {
    // TODO: use a.displayName
    const compiledRule = _compileExpression(ruleNode.expression)
    return resolver.add(ruleNode.name, compiledRule)
  })

  const firstRuleId = compiledRules[0]

  const context = new ParseContext(new ParserCache(), resolver)
  const parser = new Parser((c, s) => {
    if (initCode) {
      eval(initCode)
    }
    const firstRule = resolveParser(firstRuleId, c.resolver)
    return firstRule.parse(c, s)
  }).map(result => {
    return result.value
  })
  return new ClosedParser(parser, context)
}
