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
import { anyChar } from "../components/any"

const ref = <T>(id: string) =>
  new Parser<T>((c, s) => {
    return resolveParser<T>(id, c.resolver).parse(c, s)
  })

type PegParseResult = {
  atmark?: true
  label?: string
  matchString: string
  value: any
}

const toPegParseResult = (result: any) =>
  ({
    matchString: result,
    value: result
  } as PegParseResult)

const _compileCharacterPart: (
  c: CharacterPart,
  ignoreCase: boolean
) => Parser<PegParseResult> = (c: CharacterPart, ignoreCase: boolean) => {
  switch (c.type) {
    case "Charactor":
      return literal(c.char, ignoreCase).map(toPegParseResult)
    case "CharactorRange":
      return between(c.charStart, c.charEnd, ignoreCase).map(toPegParseResult)
  }
}

const _compileExpression: (
  exp: ExpressionNode,
  initCode: string
) => Parser<PegParseResult> = (exp: ExpressionNode, initCode: string) => {
  // console.log(exp)

  switch (exp.type) {
    case "RuleReference":
      return ref<PegParseResult>(exp.ruleName)
    case "SequenceExpression":
      return sequence(
        ...exp.children.map(a => _compileExpression(a, initCode))
      ).map(res => {
        // @が使われていたら、付いてるやつだけ返す
        const atmarks = res.filter(a => a.atmark)
        if (atmarks.length !== 0) {
          return {
            label: "",
            matchString: atmarks.reduce((p, c) => p + c.matchString, ""),
            value: atmarks.map(a => a.value)
          }
        }

        // ラベルが使われていたら、objectに変換する
        const labeled = res.filter(a => !!a.label)
        if (labeled.length !== 0) {
          let values: { [k: string]: any } = {}
          labeled.forEach(({ label, value }) => {
            values[label!] = value
          })

          return {
            label: "",
            matchString: labeled.reduce((p, c) => p + c.matchString, ""),
            value: values
          }
        }
        return {
          label: "",
          matchString: res.reduce((p, c) => p + c.matchString, ""),
          value: res.map(a => a.value)
        }
      })
    case "ChoiceExpression":
      return or(...exp.children.map(a => _compileExpression(a, initCode)))
    case "ActionExpression":
      return _compileExpression(exp.child, initCode).map(result => {
        // console.log("@p@p@@", JSON.stringify(result))

        const argumentlist: [string, any][] = [
          ["text", () => result.matchString]
        ]
        // Object.getOwnPropertyNames(global).forEach(key => {
        //   console.log("@@", key)

        //   argumentlist.push([key, (global as any)[key]])
        // })
        if (result.label) {
          argumentlist.push([result.label, result.value])
        } else {
          if (!Array.isArray(result.value)) {
            Object.keys(result.value).forEach(key => {
              argumentlist.push([key, result.value[key]])
            })
          }
        }
        // console.log("@@@y@y@y@", argumentlist)
        // console.log("@@@y@y@y2222@", result.value)

        const argkeys = argumentlist.map(([key, _]) => key)
        const argvalues = argumentlist.map(([_, value]) => value)
        const action = Function(...argkeys, initCode + "\n" + exp.actionCode)
        // console.log("@@@@@@@@@@" + exp.actionCode)

        const v = action(...argvalues)
        return {
          matchString: result.matchString,
          value: v
        }
      })
    case "CharacterClassMatcherExpression":
      const children = or(
        ...exp.targets.map(a => _compileCharacterPart(a, exp.ignoreCase))
      )
      return exp.inverted
        ? notPredicate(children).mapTo(toPegParseResult(""))
        : children
    case "LabeledExpression":
      const exp5 = _compileExpression(exp.expression, initCode)
      return exp.atmark
        ? exp5.map(result => ({
            atmark: true,
            matchString: result.matchString,
            value: result.value
          }))
        : exp5.map(result => ({
            label: exp.label,
            matchString: result.matchString,
            value: result.value
          }))
    // .debug("hogehoge")

    case "LiteralMatcher":
      return literal(exp.str, exp.ignoreCase).map(res => toPegParseResult(res))
    case "PrefixExpression":
      const exp2 = _compileExpression(exp.expression, initCode)
      switch (exp.prefixOperator) {
        case PrefixedOperatorEnum.TEXT:
          return exp2.map(res => ({
            ...res,
            value: res.matchString
          }))
        case PrefixedOperatorEnum.SIMPLE_AND:
          return exp2
        case PrefixedOperatorEnum.SIMPLE_NOT:
          return notPredicate(exp2).mapTo(toPegParseResult(""))
      }
      throw new Error("aaaaa")
    case "SuffixExpression":
      const exp3 = _compileExpression(exp.expression, initCode)
      switch (exp.suffixOperator) {
        case SuffixedOperatorEnum.OPTIONAL:
          return zeroOrOne(exp3).map(res => (res ? res : toPegParseResult("")))
        case SuffixedOperatorEnum.ZERO_OR_MORE:
          return repeat0(exp3).map(res => {
            return {
              matchString: res.reduce((p, c) => p + c.matchString, ""),
              value: res.map(a => a.value)
            }
          })
        case SuffixedOperatorEnum.ONE_OR_MORE:
          return repeat1(exp3).map(res => {
            return {
              matchString: res.reduce((p, c) => p + c.matchString, ""),
              value: res.map(a => a.value)
            }
          })
      }
      throw new Error("aaaaa")
    case "AnyMatcher":
      return anyChar.map(toPegParseResult)
    default:
      throw new Error("aaq")
  }
}

export const compile: (ast: GrammerNode) => ClosedParser<any> = ast => {
  const { initCode, rules } = ast

  const resolver = new ParserResolver()
  // TODO: use a.displayName
  const compiledRules = rules.map(ruleNode =>
    resolver.add(
      ruleNode.name,
      _compileExpression(ruleNode.expression, initCode ? initCode : "")
    )
  )
  const firstRuleId = compiledRules[0]

  const parser = new Parser((c, s) => {
    // if (initCode) {
    //   const preKeys = new Set(Object.getOwnPropertyNames(global))
    //   console.log("@@pre", preKeys.size)
    //   console.log("@@@@@eval:@@@", initCode)

    //   // eval(initCode)
    //   eval("function a(){console.log()}")
    //   const postKeys = new Set(Object.getOwnPropertyNames(global))
    //   console.log("@@post", postKeys.size)
    //   preKeys.forEach(k => {
    //     postKeys.delete(k)
    //   })
    //   console.log("aaaaaaaaa", postKeys)
    //   throw new Error("q")
    // }
    const firstRule = resolveParser(firstRuleId, c.resolver)
    return firstRule.parse(c, s)
  }).map(result => result.value)
  return new ClosedParser(parser, new ParseContext(new ParserCache(), resolver))
}
