import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class BinaryOperatorSyntaxTree extends AbstractSyntaxTree {
  constructor(
    token: Token,
    left: AbstractSyntaxTree | null = null,
    right: AbstractSyntaxTree | null = null
  ) {
    super(token, [left, right]);
  }

  public postfix() {
    return `${this.children[0]?.postfix()} ${this.children[1]?.postfix()} ${
      this.token.str
    }`;
  }
}
