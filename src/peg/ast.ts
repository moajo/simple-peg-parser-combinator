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
