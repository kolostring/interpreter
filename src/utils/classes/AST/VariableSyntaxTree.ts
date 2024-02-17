import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class VariableSyntaxTree extends AbstractSyntaxTree {
  public constructor(token: Token) {
    super(token, []);
  }
  
  public postfix(): string {
    return `${this.token.str}`;
  }
}
