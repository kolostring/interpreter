import { unaryLogicalOperators } from "../../../constants/operators";
import { UnaryOperatorSyntaxTree } from "../UnaryOperatorSyntaxTree";

export class UnaryLogicalOperatorSyntaxTree extends UnaryOperatorSyntaxTree{
  public evaluate() {
    if (this.children[0] === null) {
      throw new Error(
        `Unary Operator "${this.token}" cannot perform it's operation without an operand`
      );
    }

    const childEval = this.children[0].evaluate();

    if (this.token in unaryLogicalOperators) {
      if (typeof childEval === "boolean") {
        return unaryLogicalOperators[this.token].operation(childEval);
      } else {
        throw new Error(
          `Operator "${this.token}" performs it's operation on booleans only`
        );
      }
    }

    throw new Error(`Invalid Operator "${this.token}`);
  }
} 