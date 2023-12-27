import { binaryLogicalOperators } from "../../constants/operators";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./BinaryOperatorSyntaxTree";

export class BinaryLogicalOperatorSyntaxTree extends BinaryOperatorSyntaxTree {
  constructor(
    token: string,
    left: AbstractSyntaxTree | null = null,
    right: AbstractSyntaxTree | null = null
  ) {
    super(token, left, right);
  }
  public evaluate() {
    if (this.children[0] === null || this.children[1] === null) {
      throw new Error(
        `Operator "${this.token}" cannot perform it's operation on less than two operands`
      );
    }

    const lEval = this.children[0].evaluate();
    const rEval = this.children[1].evaluate();

    if (this.token in binaryLogicalOperators) {
      if (typeof lEval === "boolean" && typeof rEval === "boolean") {
        return binaryLogicalOperators[this.token].operation(lEval, rEval);
      } else {
        throw new Error(
          `Operator "${this.token}" performs it's operation on booleans only`
        );
      }
    }

    throw new Error(`Invalid Operator "${this.token}`);
  }
}
