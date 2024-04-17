import { keywords } from "../constants/keywords";
import { operators } from "../constants/operators";
import { TokenKind } from "../constants/tokenKinds";

export type Token = {
  str: string;
  type: TokenKind;
  pos: number
  row: number;
  col: number;
};

const bofToken = {
  str: "bof",
  type: TokenKind.BOF,
  pos: -1,
  row: 0,
  col: -1,
};

export default class Tokenizer {
  private input: string = "";
  private ptr: number = 0;
  private row: number = 0;
  private col: number = 0;
  private currentToken: Token = bofToken;
  
  constructor(str: string = "") {
    this.setInput(str);
  }
  
  public setInput(input: string) {
    this.input = input;
    this.ptr = 0;
    this.row = 0;
    this.col = 0;
    this.currentToken = bofToken;
  }
  
  public getNextToken() {
    this.advance();
    return this.currentToken;
  }

  public getCurrentToken(): Token {
    return this.currentToken;
  }

  private getCurrentChar() {
    return this.input.charAt(this.ptr);
  }

  private isCurrentCharWhiteSpace(){
    return this.getCurrentChar() === " "|| this.getCurrentChar() === "\n";
  }

  private isCurrentCharNumber(){
    return !isNaN(Number(this.getCurrentChar()));
  }

  public peekToken(nToken: number): Token {
    const currToken = this.currentToken;
    const currPtr = this.ptr;
    const currCol = this.col;
    const currRow = this.row;

    while(nToken-- > 0){
      this.advance();
    }

    const peekedToken = this.currentToken;

    this.currentToken = currToken;
    this.ptr = currPtr;
    this.col = currCol;
    this.row = currRow;

    return peekedToken;
  }

  public advance(): Token {
    const lastToken = this.currentToken;

    if (this.ptr >= this.input.length) {
      this.currentToken = {
        str: "\0",
        type: TokenKind.EOF,
        pos: this.ptr,
        row: this.row,
        col: this.col,
      };
    }
    else{
      this.tokenize();
    }

    return lastToken
  }

  private tokenize(){
    if (this.isCurrentCharWhiteSpace()) {
      this.skipWhiteSpaces();
    }

    if (this.getCurrentChar() in operators) {
      this.tokenizeOperator();
    }else if(this.isCurrentCharNumber()){
      this.tokenizeNumber();
    }else{
      this.tokenizeSymbol();
    }
  }

  private skipWhiteSpaces() {
    while (this.isCurrentCharWhiteSpace()) {
      if (this.getCurrentChar() === "\n") {
        this.col = 0;
        this.row++;
      } else {
        this.col++;
      }

      this.ptr++;
    }
  }

  private tokenizeOperator(): void {
    let operator = "";

    do {
      operator += this.getCurrentChar();
      this.ptr++;
      this.col++;
    } while (
      this.ptr < this.input.length &&
      (operator + this.getCurrentChar()) in operators
    );

    this.updateCurrentToken(operator, operators[operator].tokenID);
  }

  private tokenizeNumber(): void{
    const str = this.stripWord();

    this.updateCurrentToken(str, TokenKind.NUMBER);
  }

  private tokenizeSymbol(): void {
    const str = this.stripWord();

    if(str in keywords){
      this.updateCurrentToken(str, keywords[str])
    }
    else{
      this.updateCurrentToken(str, TokenKind.SYMBOL);
    }
  }

  private stripWord(): string {
    let str = "";

    do {
      str += this.getCurrentChar();
      this.ptr++;
      this.col++;
    } while (
      this.ptr < this.input.length &&
      !this.isCurrentCharWhiteSpace() &&
      !(this.getCurrentChar() in operators)
    );

    return str;
  }

  private updateCurrentToken(str: string, tokenID: number) {
    this.currentToken = {
      str: str,
      type: tokenID,
      pos: this.ptr - str.length,
      row: this.row,
      col: this.col - str.length,
    };
  }
}
