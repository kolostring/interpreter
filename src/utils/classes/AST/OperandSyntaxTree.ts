import { AbstractSyntaxTree } from "./AbstractSyntaxTree";


export class OperandSyntaxTree extends AbstractSyntaxTree {
  constructor(token: string) {
    super(token, []);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    throw new Error(
      `Operands "${this.token}" cannot operate over ${child.getToken()}`
    );
  }

	public evaluate() {
		return Number(this.token)
	}

  public postfix() {
    return this.token;
  }
}
