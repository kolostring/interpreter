import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class LiteralSyntaxTree extends AbstractSyntaxTree {
  constructor(token: string) {
    super(token, []);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    throw new Error(
      `Operands "${this.token}" cannot operate over ${child.getToken()}`
    );
  }

  public evaluate() {
    if(this.token === "true" || this.token === "false"){
      return Boolean(this.token);
    }
    return Number(this.token);
  }

  public postfix() {
    return this.token;
  }
}
