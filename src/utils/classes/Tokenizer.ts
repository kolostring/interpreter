import { binaryOperators, unaryOperators } from "../constants/operators";

export default class Tokenizer {
  private str: string;
  private ptr: number;

  constructor(str: string = "") {
    this.str = str;
    this.ptr = 0;
  }

  public setStr(str: string) {
    this.str = str;
    this.ptr = 0;
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
      token in binaryOperators ||
      token in unaryOperators ||
      token === "(" ||
      token === ")"
    );
  }

  public getNextToken() {
    let token = "";

    if (this.ptr >= this.str.length) {
      return null;
    }

    if (this.getCurrentChar() === " ") {
      this.skipWhiteSpaces();
    }

    do {
      token += this.getCurrentChar();
      this.ptr++;
    } while (
      this.ptr < this.str.length &&
      this.getCurrentChar() !== " " &&
      !this.isOperator(token) &&
      !this.isOperator(this.getCurrentChar())
    );

    return token;
  }
}
