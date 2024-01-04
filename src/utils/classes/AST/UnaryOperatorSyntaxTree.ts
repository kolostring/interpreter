import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class UnaryOperatorSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token, child: AbstractSyntaxTree | null = null) {
    super(token, [child]);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    if (this.children[0] === null) {
      this.children[0] = child;
    } else {
      throw new Error(
        `Unary Operator "${this.token.str}" cannot perform it's operation on more than one operand`
      );
    }
  }

  public evaluate(): number | boolean {
    throw new Error("Method not implemented.");
  }

  public postfix() {
    return `${this.children[0]?.postfix()} (${this.token.str})`;
  }
}
