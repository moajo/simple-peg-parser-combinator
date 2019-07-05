export enum SuffixedOperatorEnum {
  OPTIONAL,
  ZERO_OR_MORE,
  ONE_OR_MORE
}
export enum PrefixedOperatorEnum {
  TEXT,
  SIMPLE_AND,
  SIMPLE_NOT
}

export type LiteralMatcherNode = {
  type: "LiteralMatcher"
  str: string
  ignoreCase: boolean
}
export const makeLiteralMatcherNode = (str: string, ignoreCase: boolean) =>
  ({
    type: "LiteralMatcher",
    str,
    ignoreCase
  } as LiteralMatcherNode)

export type AnyMatcherNode = {
  type: "AnyMatcher"
}
export const makeAnyMatcherNode = () =>
  ({
    type: "AnyMatcher"
  } as AnyMatcherNode)

export type RuleReferenceNode = {
  type: "RuleReference"
  ruleName: string
}

export const makeRuleReferenceNode = (ruleName: string) =>
  ({
    type: "RuleReference",
    ruleName
  } as RuleReferenceNode)

export type CharactorNode = {
  type: "Charactor"
  char: string
}
export const makeCharactorNode = (char: string) =>
  ({
    type: "Charactor",
    char
  } as CharactorNode)
export type SemanticPredicateNode = {
  type: "SemanticPredicate"
  operator: string
  code: string
}
export const makeSemanticPredicateNode = (operator: string, code: string) =>
  ({
    type: "SemanticPredicate",
    operator,
    code
  } as SemanticPredicateNode)

export type CharactorRangeNode = {
  type: "CharactorRange"
  charStart: string
  charEnd: String
}
export const makeCharactorRangeNode = (charStart: string, charEnd: String) =>
  ({
    type: "CharactorRange",
    charStart,
    charEnd
  } as CharactorRangeNode)

type CharacterPart = CharactorNode | CharactorRangeNode

export type CharacterClassMatcherExpressionNode = {
  type: "CharacterClassMatcherExpression"
  inverted: boolean
  ignoreCase: boolean
  targets: CharacterPart[]
}
export const makeCharacterClassMatcherExpressionNode = (
  inverted: boolean,
  ignoreCase: boolean,
  targets: CharacterPart[]
) =>
  ({
    type: "CharacterClassMatcherExpression",
    inverted,
    ignoreCase,
    targets
  } as CharacterClassMatcherExpressionNode)

export type SuffixExpressionNode = {
  type: "SuffixExpression"
  suffixOperator: SuffixedOperatorEnum
  expression: ExpressionNode
}
export const makeSuffixExpressionNode = (
  suffixOperator: SuffixedOperatorEnum,
  expression: ExpressionNode
) =>
  ({
    type: "SuffixExpression",
    suffixOperator,
    expression
  } as SuffixExpressionNode)
export type PrefixExpressionNode = {
  type: "PrefixExpression"
  prefixOperator: PrefixedOperatorEnum
  expression: ExpressionNode
}
export const makePrefixExpressionNode = (
  prefixOperator: PrefixedOperatorEnum,
  expression: ExpressionNode
) =>
  ({
    type: "PrefixExpression",
    prefixOperator,
    expression
  } as PrefixExpressionNode)

export type LabeledExpressionNode = {
  type: "LabeledExpression"
  atmark: boolean
  label: string
  expression: ExpressionNode
}
export const makeLabeledExpressionNode = (
  atmark: boolean,
  label: string,
  expression: ExpressionNode
) =>
  ({
    type: "LabeledExpression",
    atmark,
    label,
    expression
  } as LabeledExpressionNode)

export type SequenceExpressionNode = {
  type: "SequenceExpression"
  children: ExpressionNode[]
}
export const makeSequenceExpressionNode = (children: ExpressionNode[]) =>
  ({
    type: "SequenceExpression",
    children
  } as SequenceExpressionNode)
export type ActionExpressionNode = {
  type: "ActionExpression"
  child: ExpressionNode
  actionCode: string
}
export const makeActionExpressionNode = (
  child: ExpressionNode,
  actionCode: string
) =>
  ({
    type: "ActionExpression",
    child,
    actionCode
  } as ActionExpressionNode)

export type ChoiceExpressionNode = {
  type: "ChoiceExpression"
  children: ExpressionNode[]
}
export const makeChoiceExpressionNode = (children: ExpressionNode[]) =>
  ({
    type: "ChoiceExpression",
    children
  } as ChoiceExpressionNode)

export type ExpressionNode =
  | CharacterClassMatcherExpressionNode
  | SuffixExpressionNode
  | PrefixExpressionNode
  | LabeledExpressionNode
  | SequenceExpressionNode
  | ActionExpressionNode
  | ChoiceExpressionNode
  | RuleReferenceNode
  | LiteralMatcherNode

export type RuleNode = {
  type: "Rule"
  name: string
  expression: ExpressionNode
  displayName?: string
}
export const makeRuleNode = (
  name: string,
  expression: ExpressionNode,
  displayName?: string
) =>
  ({
    type: "Rule",
    name,
    expression,
    displayName
  } as RuleNode)

export type GrammerNode = {
  type: "Grammer"
  rules: RuleNode[]
  initCode?: string
}
export const makeGrammerNode = (rules: RuleNode[], initCode?: string) =>
  ({
    type: "Grammer",
    rules,
    initCode
  } as GrammerNode)

export type Node =
  | LiteralMatcherNode
  | AnyMatcherNode
  | RuleReferenceNode
  | ExpressionNode
  | RuleNode
  | GrammerNode
