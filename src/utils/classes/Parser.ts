import { mathConstants, mathFunctions } from "../constants/math";
import { binaryOperators, unaryOperators } from "../constants/operators";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./AST/BinaryOperatorSyntaxTree";
import { OperandSyntaxTree } from "./AST/OperandSyntaxTree";
import { UnaryOperatorSyntaxTree } from "./AST/UnaryOperatorSyntaxTree";
import Tokenizer from "./Tokenizer";


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

  private eat(token :string){
    if (this.tokenizer.getCurrentToken() !== token) {
      throw new Error(
        `"${token}" expected at col: ${this.tokenizer.getCurrentPosition()}`
      );
    }
    this.tokenizer.advance();
  }

  private power(): AbstractSyntaxTree {
    const currentToken = this.tokenizer.getNextToken();

    if (currentToken === null) {
      throw new Error(
        `Expression expected at col: ${this.tokenizer.getCurrentPosition()}`
      );
    }
    if (currentToken === "+" || currentToken === "-") {
      return new UnaryOperatorSyntaxTree(
        currentToken,
        unaryOperators[currentToken].operation,
        this.power()
      );
    }
    if (currentToken in mathFunctions) {
      return new UnaryOperatorSyntaxTree(
        currentToken,
        mathFunctions[currentToken],
        this.power()
      );
    }

    if (!isNaN(Number(currentToken))) {
      const root = new OperandSyntaxTree(currentToken);
      this.tokenizer.advance();
      return root;
    }
    if (currentToken in mathConstants) {
      const root = new OperandSyntaxTree(mathConstants[currentToken] + "");
      this.tokenizer.advance();
      return root;
    }
    if (currentToken === "(") {
      const root = this.expression();
      this.eat(")");
      return root;
    }

    throw new Error(
      `Invalid token "${currentToken}" at col: ${this.tokenizer.getCurrentPosition()}`
    );
  }

  private factor(): AbstractSyntaxTree {
    let root = this.power();

    while (this.tokenizer.getCurrentToken() === "^") {
      root = BOST("^", root, this.factor());
    }

    return root;
  }

  private term(): AbstractSyntaxTree {
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
    let root = this.term();

    while (
      this.tokenizer.getCurrentToken() === "+" ||
      this.tokenizer.getCurrentToken() === "-"
    ) {
      root = BOST(this.tokenizer.getCurrentToken()!, root, this.term());
    }

    return root;
  }
}
