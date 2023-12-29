import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export abstract class UnaryOperatorSyntaxTree extends AbstractSyntaxTree {
  constructor(token: string, child: AbstractSyntaxTree | null = null) {
    super(token, [child]);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    if (this.children[0] === null) {
      this.children[0] = child;
    } else {
      throw new Error(
        `Unary Operator "${this.token}" cannot perform it's operation on more than one operand`
      );
    }
  }

  public postfix() {
    return `${this.children[0]?.postfix()} (${this.token})`;
  }
}
