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

export class Node {}

export class LiteralMatcherNode {
  constructor(public str: string, public ignoreCase: boolean) {}
}
export class AnyMatcherNode {
  constructor() {}
}

export class RuleReferenceNode {
  constructor(public ruleName: string) {}
}
export class ExpressionNode {
  constructor() {}
}

export class CharactorNode {
  constructor(public char: string) {}
}
export class SemanticPredicateNode {
  constructor(public operator: string, public code: string) {}
}

export class CharactorRangeNode {
  constructor(public charStart: string, public charEnd: String) {}
}

type CharacterPart = CharactorNode | CharactorRangeNode

export class CharacterClassMatcherExpressionNode extends ExpressionNode {
  constructor(
    public inverted: boolean,
    public ignoreCase: boolean,
    public targets: CharacterPart[]
  ) {
    super()
  }
}

export class SuffixExpressionNode extends ExpressionNode {
  constructor(
    public suffixOperator: SuffixedOperatorEnum,
    public expression: ExpressionNode
  ) {
    super()
  }
}
export class PrefixExpressionNode extends ExpressionNode {
  constructor(
    public prefixOperator: PrefixedOperatorEnum,
    public expression: ExpressionNode
  ) {
    super()
  }
}

export class LabeledExpressionNode extends ExpressionNode {
  constructor(
    public atmark: boolean,
    public label: string,
    public expression: ExpressionNode
  ) {
    super()
  }
}

export class SequenceExpressionNode extends ExpressionNode {
  constructor(public children: ExpressionNode[]) {
    super()
  }
}
export class ActionExpressionNode extends ExpressionNode {
  constructor(public child: ExpressionNode, public actionCode: string) {
    super()
  }
}

export class ZeroOrMoreExpressionNode extends ExpressionNode {
  constructor(public child: ExpressionNode) {
    super()
  }
}
export class ChoiceExpressionNode extends ExpressionNode {
  constructor(public children: ExpressionNode[]) {
    super()
  }
}

export class RuleNode {
  constructor(
    public name: string,
    public expression: ExpressionNode,
    public displayName?: string
  ) {}
}

export class GrammerNode {
  constructor(public rules: RuleNode[]) {}
}
