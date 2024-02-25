import { describe, expect, it } from "vitest";
import Parser from "../../utils/classes/Parser";

const parser = new Parser();

describe("Parser", () => {
  it("should parse lonely factors", () => {
    parser.setInput("123;");
    expect(parser.program().postfix()).toBe("123");
  });

  it("should parse addition and substraction", () => {
    parser.setInput("12+34;");
    expect(parser.program().postfix()).toBe("12 34 +");
    parser.setInput("12-34-56-78;");
    expect(parser.program().postfix()).toBe("12 34 - 56 - 78 -");
  });

  it("should parse multiplicatoin and division", () => {
    parser.setInput("12*34;");
    expect(parser.program().postfix()).toBe("12 34 *");
    parser.setInput("12/34/56/78;");
    expect(parser.program().postfix()).toBe("12 34 / 56 / 78 /");
  });

  it("should parse operators precedence correctly", () => {
    parser.setInput("12+34*56;");
    expect(parser.program().postfix()).toBe("12 34 56 * +");
    parser.setInput("12 + 34 * 56 / 78 + 90 / 123;");
    expect(parser.program().postfix()).toBe("12 34 56 * 78 / + 90 123 / +");
  });

  it("should parse parenthesis order correctly", () => {
    parser.setInput("(12+34)*56;");
    expect(parser.program().postfix()).toBe("12 34 + 56 *");
    parser.setInput("(12+34)*(56+78*(90+123));");
    expect(parser.program().postfix()).toBe("12 34 + 56 78 90 123 + * + *");
    parser.setInput("(12+(34*(56/(78))));");
    expect(parser.program().postfix()).toBe("12 34 56 78 / * +");
  });

  it("should parse unary arithmetic operators", () => {
    parser.setInput("1--2;");
    expect(parser.program().postfix()).toBe("1 2 (-) -");
    parser.setInput("1---(---(2--3)-4)-(-5);");
    expect(parser.program().postfix()).toBe(
      "1 2 3 (-) - (-) (-) (-) 4 - (-) (-) - 5 (-) -"
    );
  });

  it("should parse power operators with right associativity", () => {
    parser.setInput("1^2^3;");
    expect(parser.program().postfix()).toBe("1 2 3 ^ ^");
    parser.setInput("1^(2*3)^(4*5);");
    expect(parser.program().postfix()).toBe("1 2 3 * 4 5 * ^ ^");
    parser.setInput("1^(2*3^2^2^2)^(4*5);");
    expect(parser.program().postfix()).toBe("1 2 3 2 2 2 ^ ^ ^ * 4 5 * ^ ^");
  });

  it("should parse Relational Operations", () => {
    parser.setInput("12+3<45;");
    expect(parser.program().postfix()).toBe("12 3 + 45 <");
    parser.setInput("12+3 >=(45^6);");
    expect(parser.program().postfix()).toBe("12 3 + 45 6 ^ >=");
  });

  it("should parse Equality Operations", () => {
    parser.setInput("123 == 3;");
    expect(parser.program().postfix()).toBe("123 3 ==");
    parser.setInput("12+3 != (45^6);");
    expect(parser.program().postfix()).toBe("12 3 + 45 6 ^ !=");
    parser.setInput("1 == 2 != 4;");
    expect(parser.program().postfix()).toBe("1 2 == 4 !=");
    parser.setInput("1 == (2 != 30);");
    expect(parser.program().postfix()).toBe("1 2 30 != ==");
    parser.setInput("1 == (2 == ( 3 == 4));");
    expect(parser.program().postfix()).toBe("1 2 3 4 == == ==");
  });

  it("should parse Logical Operations", () => {
    parser.setInput("12 == 3 && 45 != 67;");
    expect(parser.program().postfix()).toBe("12 3 == 45 67 != &&");
    parser.setInput("12<3 && (4 > 5 || 6) || 7 != 8;");
    expect(parser.program().postfix()).toBe("12 3 < 4 5 > 6 || && 7 8 != ||");
  });

  it("should parse Unary Logical Operator", () => {
    parser.setInput("!(12 == 3) && !(!(4>5) || (6<=7));");
    expect(parser.program().postfix()).toBe("12 3 == (!) 4 5 > (!) 6 7 <= || (!) &&");
  })

  it("should parse Variables", () => {
    parser.setInput("_ab + cd2 / efg;");
    expect(parser.program().postfix()).toBe("_ab cd2 efg / +");
  })

  it("should parse Variable assignment", ()=>{
    parser.setInput("a = 123 + 4;");
    expect(parser.program().postfix()).toBe("a 123 4 + =");
  })

  it("should parse Variable declaration", ()=>{
    parser.setInput("int a;")
    expect(parser.program().postfix()).toBe("int (a)");
    parser.setInput("int a, b, c;")
    expect(parser.program().postfix()).toBe("int (a), (b), (c)");
    parser.setInput("int a = 12;")
    expect(parser.program().postfix()).toBe("int (a 12 =)");
    parser.setInput("int a = 12 * 3 + 4;")
    expect(parser.program().postfix()).toBe("int (a 12 3 * 4 + =)");

    parser.setInput("int a = 12*3+4, b, c = 56 * (7 + 8);")
    expect(parser.program().postfix()).toBe("int (a 12 3 * 4 + =), (b), (c 56 7 8 + * =)");
  })

  it("should parse several sentences", () => {
    parser.setInput("a+b+c;\nd+f+g;h+j+k;");
    expect(parser.program().postfix()).toBe("a b + c +\nd f + g +\nh j + k +");

    parser.setInput("int a = 12;\nint b = 34 + 5;6*7;");
    expect(parser.program().postfix()).toBe("int (a 12 =)\nint (b 34 5 + =)\n6 7 *");
  })

  it("should parse blocks", () => {
    parser.setInput("{}");
    expect(parser.program().postfix()).toBe("{\n}");
    parser.setInput(`{
      int a;
      a = a + 1;
      int bcd = a;
    }`)
    expect(parser.program().postfix()).toBe(`{\nint (a)\na a 1 + =\nint (bcd a =)\n}`);
  })

  it("should parse function definitions", () => {
    parser.setInput(`
    void foo(){
      int a;
      a = a + 1;
      int bcd = a;
    }`);
    expect(parser.program().postfix()).toBe("void foo(){\nint (a)\na a 1 + =\nint (bcd a =)\n}");

    parser.setInput(`int foo(int a, int b, int c){
      return a + b + c;
    }`);

    expect(parser.program().postfix()).toBe(`int foo( int (a), int (b), int (c)){\nreturn a b + c +\n}`);
  })

  it("should not allow to have missing operands", () => {
    parser.setInput("1-;");
    expect(()=>{parser.program()}).toThrowError();
    parser.setInput("1*2**3;");
    expect(()=>{parser.program()}).toThrowError();
  });

  it("should not allow to have empty expressions", () => {
    parser.setInput(";");
    expect(()=>{parser.program()}).toThrowError();
    parser.setInput("();");
    expect(()=>{parser.program()}).toThrowError();
  });

  it("should not allow to have Relational Operators next to eachother", ()=>{
    parser.setInput("1 < 2 >= 4;");
    expect(()=>{parser.program()}).toThrowError();
  })

  it("should not allow to assign to an expression", () => {
    parser.setInput("123 = 3;");
    expect(()=>{parser.program()}).toThrowError();
    parser.setInput("12 + 3 = 45;");
    expect(()=>{parser.program()}).toThrowError();
  })

  it("should not allow to have function parameters definition with wrong COMMA position", () => {
    parser.setInput("int foo(int a,){}");
    expect(()=>{parser.program()}).toThrowError();
    parser.setInput("int foo(int a,,){}");
    expect(()=>{parser.program()}).toThrowError();
    parser.setInput("int foo(int a int b){}");
    expect(()=>{parser.program()}).toThrowError();
  })
});
