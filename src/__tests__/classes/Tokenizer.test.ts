import { describe, expect, it } from "vitest";
import Tokenizer from "../../utils/classes/Tokenizer";
import { TokenKind } from "../../utils/constants/tokenKinds";

const tokenizer = new Tokenizer();

describe("Tokenizer", () => {
  it("should tokenize numbers", () => {
    tokenizer.setInput("1 23 456");
    ["1", "23", "456"].forEach((str) => {
      expect(tokenizer.getNextToken().str).toBe(str);
    });
  });

  it("should tokenize words", () => {
    tokenizer.setInput("a bc defg");
    ["a", "bc", "defg"].forEach((str) => {
      expect(tokenizer.getNextToken().str).toBe(str);
    });
  });

  it("should tokenize operators", () => {
    tokenizer.setInput("- + */");
    ["-", "+", "*", "/"].forEach((str) => {
      expect(tokenizer.getNextToken().str).toBe(str);
    });
  });
  it("should tokenize operators apart from words", () => {
    tokenizer.setInput("a+bc/d");
    ["a", "+", "bc", "/", "d"].forEach((str) => {
      expect(tokenizer.getNextToken().str).toBe(str);
    });
  });

  it("should tokenize parenthesis apart from words and other operators", () => {
    tokenizer.setInput("2+(3-(4*5)+ab)-cd");
    ["2","+","(","3","-","(","4","*","5",")","+","ab",")","-","cd"].forEach((str) => {
      expect(tokenizer.getNextToken().str).toBe(str);
    });
  });

  it("should tokenize logical operators", () => {
    tokenizer.setInput("(a+b) > 12");
    ["(", "a", "+", "b", ")", ">", "12"].forEach((str) => {
      expect(tokenizer.getNextToken().str).toBe(str);
    });
    tokenizer.setInput("a<b&&c>=d||f!=g");
    ["a", "<", "b", "&&", "c", ">=", "d", "||", "f", "!=", "g"].forEach(
      (str) => {
        expect(tokenizer.getNextToken().str).toBe(str);
      }
    );
  });
  
  it("should return EOF if there's no token left", ()=>{
    tokenizer.setInput("1");
    tokenizer.advance();
    expect(tokenizer.getNextToken().type).toBe(TokenKind.EOF);
  })
  
  it("should return correct token type", ()=>{
    tokenizer.setInput("123 true false variable ={}()+-/*; && || != ==");
    [TokenKind.NUMBER, TokenKind.TRUE, TokenKind.FALSE, TokenKind.VARIABLE, TokenKind.ASSIGN, TokenKind.L_BRACE, TokenKind.R_BRACE, TokenKind.L_PARENTHESIS, TokenKind.R_PARENTHESIS, TokenKind.PLUS, TokenKind.MINUS, TokenKind.DIV, TokenKind.MUL, TokenKind.SEMI, TokenKind.AND, TokenKind.OR, TokenKind.DIFFERENT, TokenKind.EQUAL].forEach((token)=>{
      expect(TokenKind[tokenizer.getNextToken().type]).toBe(TokenKind[token]);
    })
  })

  it("should return correct row and column", ()=>{
    tokenizer.setInput(`hello, world!\n123 + 4-3!=20`);

    [[0,0],[5,0],[7,0],[12,0],[0,1],[4,1],[6,1],[7,1],[8,1],[9,1],[11,1]].forEach(([col, row])=>{
      tokenizer.advance();
      expect(tokenizer.getCurrentToken().col).toBe(col);
      expect(tokenizer.getCurrentToken().row).toBe(row);
    })
  })
});
