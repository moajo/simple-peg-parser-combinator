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
import { pickFirst } from "../utils"
import { SuffixedOperatorEnum, PrefixedOperatorEnum } from "./ast"

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
  sequence(PrimaryExpression, __, SuffixedOperator),
  PrimaryExpression
).map()

export const LabelIdentifier = sequence(Identifier, __, literal(":")).map(a => {
  // if ( RESERVED_WORDS[ name ] !== true ) return name;

  // error( `Label can't be a reserved word "${ name }".`, location() );
  return a
})

export const PrefixedExpression = or(
  sequence(PrefixedOperator, __, SuffixedExpression).map(a => {
    //return createNode( operator, { expression } );
    return a
  }),
  SuffixedExpression
)

export const LabeledExpression = or(
  sequence(atmark, zeroOrOne(LabelIdentifier), __, PrefixedExpression),
  sequence(LabelIdentifier, __, PrefixedExpression),
  PrefixedExpression
)

export const SequenceExpression = sequence(
  LabeledExpression,
  repeat0(sequence(__, LabeledExpression))
)

export const ActionExpression = sequence(
  SequenceExpression,
  zeroOrOne(sequence(__, CodeBlock))
).map(a => {
  // if ( code === null ) return expression;
  // return createNode( "action", { expression, code } );
  return a
})

export const ChoiceExpression = sequence(
  ActionExpression,
  repeat0(sequence(__, slash as any, __, ActionExpression as any))
).map(a => {
  // if ( tail.length === 0 ) return head;
  // return createNode( "choice", {
  //     alternatives: [ head ].concat( tail ),
  // } );
  return a
})

export const Expression = ChoiceExpression

export const Rule = sequence(
  Identifier,
  __,
  zeroOrOne(sequence(StringLiteral, __).map(pickFirst)),
  equal,
  __,
  Expression,
  EOS
).map(a => {
  // if ( displayName )

  //     expression = createNode( "named", {
  //         name: displayName,
  //         expression: expression,
  //     } );

  // return createNode( "rule", { name, expression } );
  return a
})
export const Grammar = sequence(
  __,
  zeroOrOne(sequence(Initializer, __)),
  repeat1(sequence(Rule, __))
).map(a => {
  // return new ast.Grammar( initializer, rules, comments, location() );
  return a
})
