import { mathConstants } from "../constants/math";
import {
  binaryLogicalOperators,
  equalityOperators,
  relationalOperators,
  unaryArithmeticOperators,
  unaryLogicalOperators,
} from "../constants/operators";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { BinaryArithmeticOperatorSyntaxTree } from "./AST/ArithmeticSyntaxTree/BinaryArithmeticOperatorSyntaxTree";
import { BinaryLogicalOperatorSyntaxTree } from "./AST/LogicalSyntaxTree/BinaryLogicalOperatorSyntaxTree";
import { EqualityOperatorSyntaxTree } from "./AST/LogicalSyntaxTree/EqualityOperatorSyntaxTree";
import { LiteralSyntaxTree } from "./AST/LiteralSyntaxTree";
import { RelationalOperatorSyntaxTree } from "./AST/LogicalSyntaxTree/RelationalOperatorSyntaxTree";
import Tokenizer from "./Tokenizer";
import { UnaryArithmeticOperatorSyntaxTree } from "./AST/ArithmeticSyntaxTree/UnaryArithmeticSyntaxTree";
import { UnaryLogicalOperatorSyntaxTree } from "./AST/LogicalSyntaxTree/UnaryLogicalSyntaxTree";

export default class Parser {
  private tokenizer: Tokenizer;

  constructor(input: string = "") {
    this.tokenizer = new Tokenizer(input);
  }

  public setInput(input: string) {
    this.tokenizer.setStr(input);
  }

  private eat(token: string) {
    if (this.tokenizer.getCurrentToken() !== token) {
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
    if (currentToken in unaryArithmeticOperators) {
      return new UnaryArithmeticOperatorSyntaxTree(
        currentToken,
        this.basePower()
      );
    }
    if (currentToken in unaryLogicalOperators) {
      return new UnaryLogicalOperatorSyntaxTree(currentToken, this.basePower());
    }
    if (
      !isNaN(Number(currentToken)) ||
      currentToken === "true" ||
      currentToken === "false"
    ) {
      const root = new LiteralSyntaxTree(currentToken);
      this.tokenizer.advance();
      return root;
    }
    if (currentToken in mathConstants) {
      const root = new LiteralSyntaxTree(mathConstants[currentToken] + "");
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
    let root = this.basePower();

    while (this.tokenizer.getCurrentToken() === "^") {
      root = new BinaryArithmeticOperatorSyntaxTree("^", root, this.factor());
    }

    return root;
  }

  private term(): AbstractSyntaxTree {
    let root = this.factor();

    while (
      this.tokenizer.getCurrentToken() === "*" ||
      this.tokenizer.getCurrentToken() === "/"
    ) {
      root = new BinaryArithmeticOperatorSyntaxTree(
        this.tokenizer.getCurrentToken()!,
        root,
        this.factor()
      );
    }

    return root;
  }

  private arithmeitcExpression(): AbstractSyntaxTree {
    let root = this.term();

    while (
      this.tokenizer.getCurrentToken() === "+" ||
      this.tokenizer.getCurrentToken() === "-"
    ) {
      root = new BinaryArithmeticOperatorSyntaxTree(
        this.tokenizer.getCurrentToken()!,
        root,
        this.term()
      );
    }

    return root;
  }

  private relation(): AbstractSyntaxTree {
    let root = this.arithmeitcExpression();

    const currToken = this.tokenizer.getCurrentToken();
    if (currToken != null && currToken in relationalOperators) {
      const rightExp = this.arithmeitcExpression();
      if (
        rightExp.getToken() in
        {
          ...relationalOperators,
          ...binaryLogicalOperators,
          ...equalityOperators,
          ...unaryLogicalOperators,
        }
      ) {
        throw new Error(
          `Operator ${currToken} can't perform operation on booleans`
        );
      }
      root = new RelationalOperatorSyntaxTree(currToken, root, rightExp);
    }

    return root;
  }

  private equality(): AbstractSyntaxTree {
    let root = this.relation();

    const currToken = this.tokenizer.getCurrentToken();
    if (currToken != null && currToken in equalityOperators) {
      root = new EqualityOperatorSyntaxTree(currToken, root, this.relation());
    }

    return root;
  }

  private conjunction(): AbstractSyntaxTree {
    let root = this.equality();

    while (this.tokenizer.getCurrentToken() === "&&") {
      root = new BinaryLogicalOperatorSyntaxTree("&&", root, this.equality());
    }

    return root;
  }

  private disjunction(): AbstractSyntaxTree {
    let root = this.conjunction();

    while (this.tokenizer.getCurrentToken() === "||") {
      root = new BinaryLogicalOperatorSyntaxTree(
        "||",
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
