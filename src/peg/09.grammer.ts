import { literal, or } from "../index"
import { sequence } from "../components/sequence"
import { zeroOrOne, repeat0, repeat1 } from "../components/repeat"
import { _, __, EOS } from "./03.spaces"
import { dollar, and } from "./01.literal"
import { Identifier } from "./04.identifier"
import { StringLiteral } from "./05.string"
import { CodeBlock } from "./01.1.codeblock"
import { PrimaryExpression } from "./08.primaryExpression"
import { Initializer } from "./03.1.initializer"

export const PrefixedOperator = or(
  dollar.map(_ => "text"),
  and.map(_ => "simple_and"),
  literal("!").map(_ => "simple_not")
)

export const SuffixedOperator = or(
  literal("?").map(_ => {
    return "optional"
  }),
  literal("*").map(_ => {
    return "zero_or_more"
  }),
  literal("+").map(_ => {
    return "one_or_more"
  })
)

export const SuffixedExpression = or(
  sequence(PrimaryExpression, __, SuffixedOperator),
  PrimaryExpression
)

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
  sequence(
    literal("@"),
    zeroOrOne(LabelIdentifier) as any,
    __ as any,
    PrefixedExpression as any
  ),
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
  repeat0(sequence(__, literal("/") as any, __, ActionExpression as any))
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
  __ as any,
  zeroOrOne(sequence(StringLiteral, __)) as any,
  literal("=") as any,
  __ as any,
  Expression as any,
  EOS as any
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
