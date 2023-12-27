import {
  unaryArithmeticOperators,
  unaryLogicalOperators,
} from "../../constants/operators";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class UnaryOperatorSyntaxTree extends AbstractSyntaxTree {
  constructor(token: string, child: AbstractSyntaxTree | null = null) {
    super(token, [child]);
  }

  public insertChild(child: AbstractSyntaxTree): void {
    if (this.children[0] === null) {
      this.children[0] = child;
    } else {
      throw new Error(
        `Unary Operator "${this.token}" cannot perform it's operation on more than one operand`
      );
    }
  }

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

  public postfix() {
    return `${this.children[0]?.postfix()} (${this.token})`;
  }
}
