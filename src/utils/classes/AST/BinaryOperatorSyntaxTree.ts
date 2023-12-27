import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class BinaryOperatorSyntaxTree extends AbstractSyntaxTree {
  private left = 0;
  private right = 1;
  private evaluationCallback: (a: number, b: number) => number;

  constructor(
    token: string,
    evaluationCallback: (a: number, b: number) => number,
    left: AbstractSyntaxTree | null = null,
    right: AbstractSyntaxTree | null = null
  ) {
    super(token, [left, right]);
    this.evaluationCallback = evaluationCallback;
  }

  public insertChild(child: AbstractSyntaxTree): void {
    if (this.children[this.left] === null) {
      this.children[this.left] = child;
    } else if (this.children[this.right] === null) {
      this.children[this.right] = child;
    } else {
      throw new Error(
        `Binary Operator "${this.token}" cannot perform it's operation on more than two operands`
      );
    }
  }

  public evaluate() {
    if (this.children[0] === null || this.children[1] === null) {
      throw new Error(
        `Binary Operator "${this.token}" cannot perform it's operation on less than two operands`
      );
    }
    return this.evaluationCallback(
      this.children[0].evaluate(),
      this.children[1].evaluate()
    );
  }

  public postfix() {
    return `${this.children[0]?.postfix()} ${this.children[1]?.postfix()} ${this.token}`
  }
}
