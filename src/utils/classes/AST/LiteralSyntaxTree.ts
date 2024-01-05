import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class LiteralSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token) {
    super(token, []);
  }

  public evaluate() {
    if(this.token.str === "true" || this.token.str === "false"){
      return Boolean(this.token.str);
    }
    return Number(this.token.str);
  }

  public postfix() {
    return this.token.str;
  }
}
