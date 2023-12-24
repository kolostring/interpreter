import { binaryOperators, unaryOperators } from "../constants/operators";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./BinaryOperatorSyntaxTree";
import { OperandSyntaxTree } from "./OperandSyntaxTree";
import Tokenizer from "./Tokenizer";
import { UnaryOperatorSyntaxTree } from "./UnaryOperatorSyntaxTree";

const UOST = (operator: string, child: AbstractSyntaxTree) => {
  return new UnaryOperatorSyntaxTree(
    operator,
    unaryOperators[operator].operation,
    child
  );
};

const BOST = (
  operator: string,
  left: AbstractSyntaxTree,
  right: AbstractSyntaxTree
) => {
  return new BinaryOperatorSyntaxTree(
    operator,
    binaryOperators[operator].operation,
    left,
    right
  );
};

export default class Parser {
  private tokenizer: Tokenizer;

  constructor(input: string = "") {
    this.tokenizer = new Tokenizer(input);
  }

  public setInput(input: string) {
    this.tokenizer.setStr(input);
  }

  private factor(): AbstractSyntaxTree {
    this.tokenizer.advance();

    if (this.tokenizer.getCurrentToken() === null) {
      throw new Error(
        `Factor expected at col: ${this.tokenizer.getCurrentPosition()}`
      );
    }
    if (!isNaN(Number(this.tokenizer.getCurrentToken()))) {
      const root = new OperandSyntaxTree(this.tokenizer.getCurrentToken()!);
      this.tokenizer.advance();
      return root;
    }
    if (
      this.tokenizer.getCurrentToken() === "+" ||
      this.tokenizer.getCurrentToken() === "-"
    ) {
      const root = UOST(this.tokenizer.getCurrentToken()!, this.factor());
      return root;
    }
    if (this.tokenizer.getCurrentToken() === "(") {
      const root = this.expression();
      if (this.tokenizer.getCurrentToken() !== ")") {
        throw new Error(
          `Missing closure Parenthesis at col: ${this.tokenizer.getCurrentPosition()}`
        );
      }
      this.tokenizer.advance();
      return root;
    }

    throw new Error(
      `Invalid token "${this.tokenizer.getCurrentToken()}" at col: ${this.tokenizer.getCurrentPosition()}`
    );
  }

  private terminal(): AbstractSyntaxTree {
    let root = this.factor();

    while (
      this.tokenizer.getCurrentToken() === "*" ||
      this.tokenizer.getCurrentToken() === "/"
    ) {
      root = BOST(this.tokenizer.getCurrentToken()!, root, this.factor());
    }

    return root;
  }

  public expression(): AbstractSyntaxTree {
    let root = this.terminal();

    while (
      this.tokenizer.getCurrentToken() === "+" ||
      this.tokenizer.getCurrentToken() === "-"
    ) {
      root = BOST(this.tokenizer.getCurrentToken()!, root, this.terminal());
    }

    return root;
  }
}
