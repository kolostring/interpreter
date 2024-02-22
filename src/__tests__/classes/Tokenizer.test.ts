import { describe, expect, it } from "vitest";
import Tokenizer from "../../utils/classes/Tokenizer";
import { TOKEN } from "../../utils/constants/tokenTypes";

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
    expect(tokenizer.getNextToken().type).toBe(TOKEN.EOF);
  })
  
  it("should return correct token type", ()=>{
    tokenizer.setInput("123 true false variable ={}()+-/*; && || != ==");
    [TOKEN.NUMBER, TOKEN.TRUE, TOKEN.FALSE, TOKEN.VARIABLE, TOKEN.ASSIGN, TOKEN.L_BRACE, TOKEN.R_BRACE, TOKEN.L_PARENTHESIS, TOKEN.R_PARENTHESIS, TOKEN.PLUS, TOKEN.MINUS, TOKEN.DIV, TOKEN.MUL, TOKEN.SEMI, TOKEN.AND, TOKEN.OR, TOKEN.DIFFERENT, TOKEN.EQUAL].forEach((token)=>{
      expect(TOKEN[tokenizer.getNextToken().type]).toBe(TOKEN[token]);
    })
  })
});
