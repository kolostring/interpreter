import { describe, expect, it } from "vitest";
import Tokenizer from "../../utils/classes/Tokenizer";

const tokenizer = new Tokenizer();

describe("Tokenizer", () => {
  it("should tokenize numbers", () => {
    tokenizer.setStr("1 23 456");
    ["1", "23", "456"].forEach((token) => {
      expect(tokenizer.getNextToken()).toBe(token);
    });
  });

  it("should tokenize words", () => {
    tokenizer.setStr("a bc defg");
    ["a", "bc", "defg"].forEach((token) => {
      expect(tokenizer.getNextToken()).toBe(token);
    });
  });

  it("should tokenize operators", () => {
    tokenizer.setStr("- + */");
    ["-", "+", "*", "/"].forEach((token) => {
      expect(tokenizer.getNextToken()).toBe(token);
    });
  });
  it("should tokenize operators apart from words", () => {
    tokenizer.setStr("a+bc/d");
    ["a", "+", "bc", "/", "d"].forEach((token) => {
      expect(tokenizer.getNextToken()).toBe(token);
    });
  });

  it("should tokenize parenthesis apart from words and other operators", () => {
    tokenizer.setStr("2+(3-(4*5)+ab)-cd");
    ["2","+","(","3","-","(","4","*","5",")","+","ab",")","-","cd"].forEach((token) => {
      expect(tokenizer.getNextToken()).toBe(token);
    });
  });

  it("should tokenize logical operators", () => {
    tokenizer.setStr("(a+b) > 12");
    ["(", "a", "+", "b", ")", ">", "12"].forEach((token) => {
      expect(tokenizer.getNextToken()).toBe(token);
    });
    tokenizer.setStr("a<b&&c>=d||f!=g");
    ["a", "<", "b", "&&", "c", ">=", "d", "||", "f", "!=", "g"].forEach(
      (token) => {
        expect(tokenizer.getNextToken()).toBe(token);
      }
    );
  });
  
  it("should return NULL if there's no token", ()=>{
    tokenizer.setStr("1");
    tokenizer.getNextToken();
    expect(tokenizer.getNextToken()).toBeNull();
  })
});
