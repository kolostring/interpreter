import { unaryArithmeticOperators } from "../../../constants/operators";
import { UnaryOperatorSyntaxTree } from "../UnaryOperatorSyntaxTree";

export class UnaryArithmeticOperatorSyntaxTree extends UnaryOperatorSyntaxTree{
  public evaluate() {
    if (this.children[0] === null) {
      throw new Error(
        `Unary Operator "${this.token}" cannot perform it's operation without an operand`
      );
    }

    const childEval = this.children[0].evaluate();

    if (this.token in unaryArithmeticOperators) {
      if (typeof childEval === "number") {
        return unaryArithmeticOperators[this.token].operation(childEval);
      } else {
        throw new Error(
          `Operator "${this.token}" performs it's operation on numbers only`
        );
      }
    }

    throw new Error(`Invalid Operator "${this.token}`);
  }
} 