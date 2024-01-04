import {
  binaryLogicalOperators,
  equalityOperators,
  relationalOperators,
  unaryArithmeticOperators,
  unaryLogicalOperators,
} from "../constants/operators";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./AST/BinaryOperatorSyntaxTree";
import { LiteralSyntaxTree } from "./AST/LiteralSyntaxTree";
import { UnaryOperatorSyntaxTree } from "./AST/UnaryOperatorSyntaxTree";
import Tokenizer from "./Tokenizer";

export default class Parser {
  private tokenizer: Tokenizer;

  constructor(input: string = "") {
    this.tokenizer = new Tokenizer(input);
  }

  public setInput(input: string) {
    this.tokenizer.setInput(input);
  }

  private eat(token: string) {
    if (this.tokenizer.getCurrentToken().str !== token) {
      throw new Error(
        `"${token}" expected at col: ${this.tokenizer.getCurrentPosition()}`
      );
    }
    this.tokenizer.advance();
  }

  private basePower(): AbstractSyntaxTree {
    const currentToken = this.tokenizer.getNextToken();

    if (currentToken === null) {
      throw new Error(
        `Expression expected at col: ${this.tokenizer.getCurrentPosition()}`
      );
    }
    if (currentToken.str in unaryArithmeticOperators) {
      return new UnaryOperatorSyntaxTree(
        currentToken,
        this.basePower()
      );
    }
    if (currentToken.str in unaryLogicalOperators) {
      return new UnaryOperatorSyntaxTree(currentToken, this.basePower());
    }
    if (
      !isNaN(Number(currentToken.str)) ||
      currentToken.str === "true" ||
      currentToken.str === "false"
    ) {
      const root = new LiteralSyntaxTree(currentToken);
      this.tokenizer.advance();
      return root;
    }
    if (currentToken.str === "(") {
      const root = this.expression();
      this.eat(")");
      return root;
    }

    throw new Error(
      `Invalid token "${currentToken.str}" at col: ${this.tokenizer.getCurrentPosition()}`
    );
  }

  private factor(): AbstractSyntaxTree {
    let root = this.basePower();

    while (this.tokenizer.getCurrentToken().str === "^") {
      root = new BinaryOperatorSyntaxTree(this.tokenizer.getCurrentToken(), root, this.factor());
    }

    return root;
  }

  private term(): AbstractSyntaxTree {
    let root = this.factor();

    while (
      this.tokenizer.getCurrentToken().str === "*" ||
      this.tokenizer.getCurrentToken().str === "/"
    ) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.getCurrentToken(),
        root,
        this.factor()
      );
    }

    return root;
  }

  private arithmeitcExpression(): AbstractSyntaxTree {
    let root = this.term();

    while (
      this.tokenizer.getCurrentToken().str === "+" ||
      this.tokenizer.getCurrentToken().str === "-"
    ) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.getCurrentToken(),
        root,
        this.term()
      );
    }

    return root;
  }

  private relation(): AbstractSyntaxTree {
    let root = this.arithmeitcExpression();

    const currToken = this.tokenizer.getCurrentToken();
    if (currToken != null && currToken.str in relationalOperators) {
      const rightExp = this.arithmeitcExpression();
      if (
        rightExp.getToken().str in
        {
          ...relationalOperators,
          ...binaryLogicalOperators,
          ...equalityOperators,
          ...unaryLogicalOperators,
        }
      ) {
        throw new Error(
          `Operator ${currToken.str} can't perform operation on booleans`
        );
      }
      root = new BinaryOperatorSyntaxTree(currToken, root, rightExp);
    }

    return root;
  }

  private equality(): AbstractSyntaxTree {
    let root = this.relation();

    const currToken = this.tokenizer.getCurrentToken();
    if (currToken != null && currToken.str in equalityOperators) {
      root = new BinaryOperatorSyntaxTree(currToken, root, this.relation());
    }

    return root;
  }

  private conjunction(): AbstractSyntaxTree {
    let root = this.equality();

    while (this.tokenizer.getCurrentToken().str === "&&") {
      root = new BinaryOperatorSyntaxTree(this.tokenizer.getCurrentToken(), root, this.equality());
    }

    return root;
  }

  private disjunction(): AbstractSyntaxTree {
    let root = this.conjunction();

    while (this.tokenizer.getCurrentToken().str === "||") {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.getCurrentToken(),
        root,
        this.conjunction()
      );
    }

    return root;
  }

  private expression(): AbstractSyntaxTree {
    return this.disjunction();
  }

  public sentence(): AbstractSyntaxTree {
    const root = this.expression();
    this.eat(";");
    return root;
  }
}
