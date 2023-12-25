import { describe, expect, it } from "vitest";
import Parser from "../../utils/classes/Parser";

const parser = new Parser();

describe("Parser", () => {
  it("should parse lonely factors", () => {
    parser.setInput("123");
    expect(parser.expression().postfix()).toBe("123");
  });

  it("should parse addition and substraction", () => {
    parser.setInput("12+34");
    expect(parser.expression().postfix()).toBe("12 34 +");
    parser.setInput("12-34-56-78");
    expect(parser.expression().postfix()).toBe("12 34 - 56 - 78 -");
  });

  it("should parse multiplicatoin and division", () => {
    parser.setInput("12*34");
    expect(parser.expression().postfix()).toBe("12 34 *");
    parser.setInput("12/34/56/78");
    expect(parser.expression().postfix()).toBe("12 34 / 56 / 78 /");
  });

  it("should parse operators precedence correctly", () => {
    parser.setInput("12+34*56");
    expect(parser.expression().postfix()).toBe("12 34 56 * +");
    parser.setInput("12 + 34 * 56 / 78 + 90 / 123");
    expect(parser.expression().postfix()).toBe("12 34 56 * 78 / + 90 123 / +");
  });

  it("should parse parenthesis order correctly", () => {
    parser.setInput("(12+34)*56");
    expect(parser.expression().postfix()).toBe("12 34 + 56 *");
    parser.setInput("(12+34)*(56+78*(90+123))");
    expect(parser.expression().postfix()).toBe("12 34 + 56 78 90 123 + * + *");
  });

  it("should parse unary operators", () => {
    parser.setInput("1--2");
    expect(parser.expression().postfix()).toBe("1 2 -1 * -");
    parser.setInput("1---(---(2--3)-4)-(-5)");
    expect(parser.expression().postfix()).toBe(
      "1 2 3 -1 * - -1 * -1 * -1 * 4 - -1 * -1 * - 5 -1 * -"
    );
  });

  it("should parse power operators with right associativity", () => {
    parser.setInput("1^2^3");
    expect(parser.expression().postfix()).toBe("1 2 3 ^ ^");
    parser.setInput("1^(2*3)^(4*5)");
    expect(parser.expression().postfix()).toBe("1 2 3 * 4 5 * ^ ^");
  })

  it("should not allow to have missing operands", () => {
    ["1-", "1*2**3"].forEach((input) => {
      parser.setInput(input);
      expect(() => {
        parser.expression();
      }).toThrowError();
    });
  });

  it("should not allow to have empty expressions", () => {
    ["", "()"].forEach((input) => {
      parser.setInput(input);
      expect(() => {
        parser.expression();
      }).toThrowError();
    });
  });
});
