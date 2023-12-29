import { unaryLogicalOperators } from "../../../constants/operators";
import { AbstractSyntaxTree } from "../AbstractSyntaxTree";
import { UnaryOperatorSyntaxTree } from "../UnaryOperatorSyntaxTree";

export class UnaryLogicalOperatorSyntaxTree extends UnaryOperatorSyntaxTree {
  constructor(token: string, child: AbstractSyntaxTree | null = null) {
    super(token, child);

    if (token in unaryLogicalOperators === false) {
      throw new Error(`Invalid Operator "${this.token}`);
    }
  }

  public evaluate() {
    if (this.children[0] === null) {
      throw new Error(
        `Unary Operator "${this.token}" cannot perform it's operation without an operand`
      );
    }

    const childEval = this.children[0].evaluate();

    if (typeof childEval === "boolean") {
      return unaryLogicalOperators[this.token].operation(childEval);
    } else {
      throw new Error(
        `Operator "${this.token}" performs it's operation on booleans only`
      );
    }
  }
}
