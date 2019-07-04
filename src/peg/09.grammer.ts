import { literal, or } from "../index"
import { sequence } from "../components/sequence"
import { zeroOrOne, repeat0, repeat1 } from "../components/repeat"
import { _, __, EOS } from "./03.spaces"
import {
  dollar,
  and,
  atmark,
  slash,
  equal,
  exclamation,
  question,
  star,
  plus
} from "./01.literal"
import { Identifier } from "./04.identifier"
import { StringLiteral } from "./05.string"
import { CodeBlock } from "./01.1.codeblock"
import { PrimaryExpression } from "./08.primaryExpression"
import { Initializer } from "./03.1.initializer"
import { pickFirst, pickSecond } from "../utils"
import {
  SuffixedOperatorEnum,
  PrefixedOperatorEnum,
  SuffixExpressionNode,
  PrefixExpressionNode,
  RuleNode,
  LabeledExpressionNode,
  SequenceExpressionNode,
  ActionExpressionNode,
  ChoiceExpressionNode,
  GrammerNode
} from "./ast"

export const PrefixedOperator = or(
  dollar.mapTo(PrefixedOperatorEnum.TEXT),
  and.mapTo(PrefixedOperatorEnum.SIMPLE_AND),
  exclamation.mapTo(PrefixedOperatorEnum.SIMPLE_NOT)
)

export const SuffixedOperator = or(
  question.mapTo(SuffixedOperatorEnum.OPTIONAL),
  star.mapTo(SuffixedOperatorEnum.ZERO_OR_MORE),
  plus.mapTo(SuffixedOperatorEnum.ONE_OR_MORE)
)

export const SuffixedExpression = or(
  sequence(PrimaryExpression, __, SuffixedOperator).map(
    ([a, _, c]) => new SuffixExpressionNode(c, a)
  ),
  PrimaryExpression
).map(a => {
  return a
})

export const LabelIdentifier = sequence(Identifier, __, literal(":")).map(a => {
  // if ( RESERVED_WORDS[ name ] !== true ) return name;

  // error( `Label can't be a reserved word "${ name }".`, location() );
  return a[0]
})

export const PrefixedExpression = or(
  sequence(PrefixedOperator, __, SuffixedExpression).map(
    ([c, _, a]) => new PrefixExpressionNode(c, a)
  ),
  SuffixedExpression
)

export const LabeledExpression = or(
  sequence(atmark, zeroOrOne(LabelIdentifier), __, PrefixedExpression).map(
    ([_, a, __, b]) => new LabeledExpressionNode(true, a === null ? "" : a, b)
  ),
  sequence(LabelIdentifier, __, PrefixedExpression).map(
    ([a, _, b]) => new LabeledExpressionNode(false, a, b)
  ),
  PrefixedExpression
)

export const SequenceExpression = sequence(
  LabeledExpression,
  repeat0(sequence(__, LabeledExpression).map(pickSecond))
).map(([a, b]) => {
  if (b.length != 0) {
    return new SequenceExpressionNode([a, ...b])
  }
  return a
})

export const ActionExpression = sequence(
  SequenceExpression,
  zeroOrOne(sequence(__, CodeBlock).map(pickSecond))
).map(([a, b]) => (b === null ? a : new ActionExpressionNode(a, b)))

export const ChoiceExpression = sequence(
  ActionExpression,
  repeat0(sequence(__, slash, __, ActionExpression).map(([_, _a, __, b]) => b))
).map(([a, b]) => (b.length === 0 ? a : new ChoiceExpressionNode([a, ...b])))

export const Expression = ChoiceExpression

export const Rule = sequence(
  Identifier,
  __,
  zeroOrOne(sequence(StringLiteral, __).map(pickFirst)),
  equal,
  __,
  Expression,
  EOS
).map(([name, _, displayName, __, ___, expression, ____]) =>
  displayName === null
    ? new RuleNode(name, expression)
    : new RuleNode(name, expression, displayName)
)
export const Grammar = sequence(
  __,
  zeroOrOne(sequence(Initializer, __).map(pickFirst)),
  repeat1(sequence(Rule, __).map(pickFirst))
).map(([_, init, rules]) => {
  if (init === null) {
    return new GrammerNode(rules)
  } else {
    throw new Error("wip")
  }
})
