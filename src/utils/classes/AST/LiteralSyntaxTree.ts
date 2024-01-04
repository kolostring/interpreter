import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class LiteralSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token) {
    super(token, []);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    throw new Error(
      `Operands "${this.token.str}" cannot operate over ${child.getToken().str}`
    );
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
