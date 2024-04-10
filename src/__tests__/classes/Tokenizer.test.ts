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
    [TokenKind.NUMBER, TokenKind.TRUE, TokenKind.FALSE, TokenKind.SYMBOL, TokenKind.ASSIGN, TokenKind.L_BRACE, TokenKind.R_BRACE, TokenKind.L_PARENTHESIS, TokenKind.R_PARENTHESIS, TokenKind.PLUS, TokenKind.MINUS, TokenKind.DIV, TokenKind.MUL, TokenKind.SEMI, TokenKind.AND, TokenKind.OR, TokenKind.DIFFERENT, TokenKind.EQUAL].forEach((token)=>{
      expect(TokenKind[tokenizer.getNextToken().type]).toBe(TokenKind[token]);
    })
  })

  it("should return correct row and column", ()=>{
    tokenizer.setInput(`hello, world!\n123 + 4-3!=20`);
    tokenizer.peekToken(8);

    [[0,0,0],[5,5,0],[7,7,0],[12,12,0],[14,0,1],[18,4,1],[20,6,1],[21,7,1],[22,8,1],[23,9,1],[25,11,1]].forEach(([pos, col, row])=>{
      tokenizer.advance();
      expect(tokenizer.getCurrentToken().pos).toBe(pos);
      expect(tokenizer.getCurrentToken().col).toBe(col);
      expect(tokenizer.getCurrentToken().row).toBe(row);
    })
  })

  it("should peek tokens correctly without modifying position", ()=>{
    tokenizer.setInput("ab cd fg");
    tokenizer.advance();

    ["ab", "cd", "fg"].forEach((str, index)=>{
      expect(tokenizer.peekToken(index).str).toBe(str);
    })

    expect(tokenizer.getCurrentToken().str).toBe("ab");
  })
});
