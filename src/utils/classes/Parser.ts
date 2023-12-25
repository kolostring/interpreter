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
    const currentToken = this.tokenizer.getCurrentToken();

    if (currentToken === null) {
      throw new Error(
        `Factor expected at col: ${this.tokenizer.getCurrentPosition()}`
      );
    }
    if (!isNaN(Number(currentToken))) {
      const root = new OperandSyntaxTree(currentToken);
      this.tokenizer.advance();
      return root;
    }
    if (
      currentToken === "+" ||
      currentToken === "-"
    ) {
      const root = UOST(currentToken, this.factor());
      return root;
    }
    if (currentToken === "(") {
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
      `Invalid token "${currentToken}" at col: ${this.tokenizer.getCurrentPosition()}`
    );
  }

  private power(): AbstractSyntaxTree {
    let root = this.factor();

    while (this.tokenizer.getCurrentToken() === "^"){
      root = BOST("^", root, this.power());
    }

    return root;
  }

  private terminal(): AbstractSyntaxTree {
    let root = this.power();

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
