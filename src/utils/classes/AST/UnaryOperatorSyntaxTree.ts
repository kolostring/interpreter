import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class UnaryOperatorSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token, child: AbstractSyntaxTree | null = null) {
    super(token, [child]);
  }

  public evaluate(): number | boolean {
    throw new Error("Method not implemented.");
  }

  public postfix() {
    return `${this.children[0]?.postfix()} (${this.token.str})`;
  }
}
