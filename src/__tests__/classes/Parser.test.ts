import { describe, expect, it } from "vitest";
import Parser from "../../utils/classes/Parser";

const parser = new Parser();

describe("Parser", () => {
  it("should parse lonely factors", () => {
    parser.setInput("123;");
    expect(parser.sentence().postfix()).toBe("123");
  });

  it("should parse addition and substraction", () => {
    parser.setInput("12+34;");
    expect(parser.sentence().postfix()).toBe("12 34 +");
    parser.setInput("12-34-56-78;");
    expect(parser.sentence().postfix()).toBe("12 34 - 56 - 78 -");
  });

  it("should parse multiplicatoin and division", () => {
    parser.setInput("12*34;");
    expect(parser.sentence().postfix()).toBe("12 34 *");
    parser.setInput("12/34/56/78;");
    expect(parser.sentence().postfix()).toBe("12 34 / 56 / 78 /");
  });

  it("should parse operators precedence correctly", () => {
    parser.setInput("12+34*56;");
    expect(parser.sentence().postfix()).toBe("12 34 56 * +");
    parser.setInput("12 + 34 * 56 / 78 + 90 / 123;");
    expect(parser.sentence().postfix()).toBe("12 34 56 * 78 / + 90 123 / +");
  });

  it("should parse parenthesis order correctly", () => {
    parser.setInput("(12+34)*56;");
    expect(parser.sentence().postfix()).toBe("12 34 + 56 *");
    parser.setInput("(12+34)*(56+78*(90+123));");
    expect(parser.sentence().postfix()).toBe("12 34 + 56 78 90 123 + * + *");
    parser.setInput("(12+(34*(56/(78))));");
    expect(parser.sentence().postfix()).toBe("12 34 56 78 / * +");
  });

  it("should parse unary arithmetic operators", () => {
    parser.setInput("1--2;");
    expect(parser.sentence().postfix()).toBe("1 2 (-) -");
    parser.setInput("1---(---(2--3)-4)-(-5);");
    expect(parser.sentence().postfix()).toBe(
      "1 2 3 (-) - (-) (-) (-) 4 - (-) (-) - 5 (-) -"
    );
  });

  it("should parse power operators with right associativity", () => {
    parser.setInput("1^2^3;");
    expect(parser.sentence().postfix()).toBe("1 2 3 ^ ^");
    parser.setInput("1^(2*3)^(4*5);");
    expect(parser.sentence().postfix()).toBe("1 2 3 * 4 5 * ^ ^");
    parser.setInput("1^(2*3^2^2^2)^(4*5);");
    expect(parser.sentence().postfix()).toBe("1 2 3 2 2 2 ^ ^ ^ * 4 5 * ^ ^");
  });

  it("should parse Relational Operations", () => {
    parser.setInput("12+3<45;");
    expect(parser.sentence().postfix()).toBe("12 3 + 45 <");
    parser.setInput("12+3 >=(45^6);");
    expect(parser.sentence().postfix()).toBe("12 3 + 45 6 ^ >=");
  });

  it("should parse Equality Operations", () => {
    parser.setInput("123 == 3;");
    expect(parser.sentence().postfix()).toBe("123 3 ==");
    parser.setInput("12+3 != (45^6);");
    expect(parser.sentence().postfix()).toBe("12 3 + 45 6 ^ !=");
  });

  it("should parse Logical Operations", () => {
    parser.setInput("12 == 3 && 45 != 67;");
    expect(parser.sentence().postfix()).toBe("12 3 == 45 67 != &&");
    parser.setInput("12<3 && (4 > 5 || 6) || 7 != 8;");
    expect(parser.sentence().postfix()).toBe("12 3 < 4 5 > 6 || && 7 8 != ||");
  });

  it("should parse Unary Logical Operator", () => {
    parser.setInput("!(12 == 3) && !(!(4>5) || (6<=7));");
    expect(parser.sentence().postfix()).toBe("12 3 == (!) 4 5 > (!) 6 7 <= || (!) &&");
  })

  it("should not allow to have missing operands", () => {
    parser.setInput("1-;");
    expect(()=>{parser.sentence()}).toThrowError();
    parser.setInput("1*2**3;");
    expect(()=>{parser.sentence()}).toThrowError();
  });

  it("should not allow to have empty expressions", () => {
    parser.setInput(";");
    expect(()=>{parser.sentence()}).toThrowError();
    parser.setInput("();");
    expect(()=>{parser.sentence()}).toThrowError();
  });

  it("should not allow to have Relational Operators next to eachother", ()=>{
    parser.setInput("1 < 2 >= 4;");
    expect(()=>{parser.sentence()}).toThrowError();
    parser.setInput("1 >= (2 < 30);");
    expect(()=>{parser.sentence()}).toThrowError();
    parser.setInput("1 < (2 > ( 3 > 4));");
    expect(()=>{parser.sentence()}).toThrowError();
  })

  it("should not allow to have Equality Operators next to eachother", ()=>{
    parser.setInput("1 == 2 != 4;");
    expect(()=>{parser.sentence()}).toThrowError();
    parser.setInput("1 == (2 !== 30);");
    expect(()=>{parser.sentence()}).toThrowError();
    parser.setInput("1 == (2 == ( 3 == 4);");
    expect(()=>{parser.sentence()}).toThrowError();
  })
});
