import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class ReturnStatementSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token, expression: AbstractSyntaxTree) {
    super(token, [expression]);
  }

  public postfix(): string {
    return this.token.str + " " + this.children[0]?.postfix();
  }
}