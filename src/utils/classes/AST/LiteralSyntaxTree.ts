import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class LiteralSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token) {
    super(token, []);
  }
  
  public postfix() {
    return this.token.str;
  }
}
