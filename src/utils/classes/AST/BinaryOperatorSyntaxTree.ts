import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class BinaryOperatorSyntaxTree extends AbstractSyntaxTree {
  private left = 0;
  private right = 1;

  constructor(
    token: Token,
    left: AbstractSyntaxTree | null = null,
    right: AbstractSyntaxTree | null = null
  ) {
    super(token, [left, right]);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    if (this.children[this.left] === null) {
      this.children[this.left] = child;
    } else if (this.children[this.right] === null) {
      this.children[this.right] = child;
    } else {
      throw new Error(
        `Binary Operator "${this.token.str}" cannot perform it's operation on more than two operands`
      );
    }
  }

  public evaluate(): number | boolean {
    throw new Error("Method not implemented.");
  }

  public postfix() {
    return `${this.children[0]?.postfix()} ${this.children[1]?.postfix()} ${
      this.token.str
    }`;
  }
}
