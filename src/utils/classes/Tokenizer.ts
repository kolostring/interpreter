import {
  binaryArithmeticOperators,
  binaryLogicalOperators,
  equalityOperators,
  relationalOperators,
  unaryArithmeticOperators,
  unaryLogicalOperators,
} from "../constants/operators";

export default class Tokenizer {
  private str: string = "";
  private ptr: number = 0;
  private currentToken: string | null = null;

  constructor(str: string = "") {
    this.setStr(str);
  }

  public setStr(str: string) {
    this.str = str;
    this.ptr = 0;
    this.currentToken = null;
  }

  private getCurrentChar() {
    return this.str.charAt(this.ptr);
  }

  private skipWhiteSpaces() {
    while (this.getCurrentChar() === " ") {
      this.ptr++;
    }
  }

  private isOperator(token: string) {
    return (
      token in binaryArithmeticOperators ||
      token in binaryLogicalOperators ||
      token in relationalOperators ||
      token in equalityOperators ||
      token in unaryArithmeticOperators ||
      token in unaryLogicalOperators ||
      token === "(" ||
      token === ")" ||
      token === "=" ||
      token === "&" ||
      token === "|"
    );
  }

  private getOperator() {
    let token = "";

    do {
      token += this.getCurrentChar();
      this.ptr++;
    } while (
      this.ptr < this.str.length &&
      this.isOperator(token + this.getCurrentChar())
    );

    return token;
  }

  public advance(): void {
    let token = "";

    if (this.ptr >= this.str.length) {
      this.currentToken = null;
      return;
    }

    if (this.getCurrentChar() === " ") {
      this.skipWhiteSpaces();
    }

    if (this.isOperator(this.getCurrentChar())) {
      this.currentToken = this.getOperator();
      return;
    }

    do {
      token += this.getCurrentChar();
      this.ptr++;
    } while (
      this.ptr < this.str.length &&
      this.getCurrentChar() !== " " &&
      !this.isOperator(this.getCurrentChar())
    );

    this.currentToken = token;
  }

  public getCurrentPosition() {
    return this.ptr;
  }

  public getCurrentToken() {
    return this.currentToken;
  }

  public getNextToken() {
    this.advance();
    return this.getCurrentToken();
  }
}
