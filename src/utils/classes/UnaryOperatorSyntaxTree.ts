import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class UnaryOperatorSyntaxTree extends AbstractSyntaxTree {
  private evaluationCallback: (a: number) => number;

  constructor(
    token: string,
    evaluationCallback: (a: number) => number,
    child: AbstractSyntaxTree | null = null
  ) {
    super(token, [child]);
    this.evaluationCallback = evaluationCallback;
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
    return this.evaluationCallback(this.children[0].evaluate());
  }

  public postfix() {
    return `${this.children[0]?.postfix()} => ${this.token}`
  }
}
