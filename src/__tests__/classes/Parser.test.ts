import { describe, expect, it } from "vitest";
import Parser from "../../utils/classes/Parser";
import postfix from "../../utils/constants/postfixFunctions";

const parser = new Parser();

describe("Parser", () => {
  it("should parse lonely factors", () => {
    parser.setInput("123;");
    expect(postfix(parser.program())).toBe("123");
  });

  it("should parse addition and substraction", () => {
    parser.setInput("12+34;");
    expect(postfix(parser.program())).toBe("12 34 +");
    parser.setInput("12-34-56-78;");
    expect(postfix(parser.program())).toBe("12 34 - 56 - 78 -");
  });

  it("should parse multiplicatoin and division", () => {
    parser.setInput("12*34;");
    expect(postfix(parser.program())).toBe("12 34 *");
    parser.setInput("12/34/56/78;");
    expect(postfix(parser.program())).toBe("12 34 / 56 / 78 /");
  });

  it("should parse operators precedence correctly", () => {
    parser.setInput("12+34*56;");
    expect(postfix(parser.program())).toBe("12 34 56 * +");
    parser.setInput("12 + 34 * 56 / 78 + 90 / 123;");
    expect(postfix(parser.program())).toBe("12 34 56 * 78 / + 90 123 / +");
  });

  it("should parse parenthesis order correctly", () => {
    parser.setInput("(12+34)*56;");
    expect(postfix(parser.program())).toBe("12 34 + 56 *");
    parser.setInput("(12+34)*(56+78*(90+123));");
    expect(postfix(parser.program())).toBe("12 34 + 56 78 90 123 + * + *");
    parser.setInput("(12+(34*(56/(78))));");
    expect(postfix(parser.program())).toBe("12 34 56 78 / * +");
  });

  it("should parse unary arithmetic operators", () => {
    parser.setInput("1--2;");
    expect(postfix(parser.program())).toBe("1 2 (-) -");
    parser.setInput("1---(---(2--3)-4)-(-5);");
    expect(postfix(parser.program())).toBe(
      "1 2 3 (-) - (-) (-) (-) 4 - (-) (-) - 5 (-) -"
    );
  });

  it("should parse power operators with right associativity", () => {
    parser.setInput("1**2**3;");
    expect(postfix(parser.program())).toBe("1 2 3 ** **");
    parser.setInput("1**(2*3)**(4*5);");
    expect(postfix(parser.program())).toBe("1 2 3 * 4 5 * ** **");
    parser.setInput("1**(2*3**2**2**2)**(4*5);");
    expect(postfix(parser.program())).toBe("1 2 3 2 2 2 ** ** ** * 4 5 * ** **");
  });

  it("should parse Relational Operations", () => {
    parser.setInput("12+3<45;");
    expect(postfix(parser.program())).toBe("12 3 + 45 <");
    parser.setInput("12+3 >=(45**6);");
    expect(postfix(parser.program())).toBe("12 3 + 45 6 ** >=");
  });

  it("should parse Equality Operations", () => {
    parser.setInput("123 == 3;");
    expect(postfix(parser.program())).toBe("123 3 ==");
    parser.setInput("12+3 != (45**6);");
    expect(postfix(parser.program())).toBe("12 3 + 45 6 ** !=");
    parser.setInput("1 == 2 != 4;");
    expect(postfix(parser.program())).toBe("1 2 == 4 !=");
    parser.setInput("1 == (2 != 30);");
    expect(postfix(parser.program())).toBe("1 2 30 != ==");
    parser.setInput("1 == (2 == ( 3 == 4));");
    expect(postfix(parser.program())).toBe("1 2 3 4 == == ==");
  });

  it("should parse Logical Operations", () => {
    parser.setInput("12 == 3 && 45 != 67;");
    expect(postfix(parser.program())).toBe("12 3 == 45 67 != &&");
    parser.setInput("12<3 && (4 > 5 || 6) || 7 != 8;");
    expect(postfix(parser.program())).toBe("12 3 < 4 5 > 6 || && 7 8 != ||");
  });

  it("should parse Unary Logical Operator", () => {
    parser.setInput("!(12 == 3) && !(!(4>5) || (6<=7));");
    expect(postfix(parser.program())).toBe("12 3 == (!) 4 5 > (!) 6 7 <= || (!) &&");
  })

  it("should parse Variables", () => {
    parser.setInput("_ab + cd2 / efg;");
    expect(postfix(parser.program())).toBe("_ab cd2 efg / +");
  })

  it("should parse Variable assignment", ()=>{
    parser.setInput("a = 123 + 4;");
    expect(postfix(parser.program())).toBe("a = 123 4 +");
  })

  it("should parse Variable declaration", ()=>{
    parser.setInput("int a;")
    expect(postfix(parser.program())).toBe("int (a)");
    parser.setInput("int a, b, c;")
    expect(postfix(parser.program())).toBe("int (a), (b), (c)");
    parser.setInput("int a = 12;")
    expect(postfix(parser.program())).toBe("int (a = 12)");
    parser.setInput("int a = 12 * 3 + 4;")
    expect(postfix(parser.program())).toBe("int (a = 12 3 * 4 +)");

    parser.setInput("int a = 12*3+4, b, c = 56 * (7 + 8);")
    expect(postfix(parser.program())).toBe("int (a = 12 3 * 4 +), (b), (c = 56 7 8 + *)");
  })

  it("should parse several sentences", () => {
    parser.setInput("a+b+c;\nd+f+g;h+j+k;");
    expect(postfix(parser.program())).toBe("a b + c +\nd f + g +\nh j + k +");

    parser.setInput("int a = 12;\nint b = 34 + 5;6*7;");
    expect(postfix(parser.program())).toBe("int (a = 12)\nint (b = 34 5 +)\n6 7 *");
  })

  it("should parse blocks", () => {
    parser.setInput("{}");
    expect(postfix(parser.program())).toBe("{\n}");
    parser.setInput(`{
      int a;
      a = a + 1;
      int bcd = a;
    }`)
    expect(postfix(parser.program())).toBe(`{\nint (a)\na = a 1 +\nint (bcd = a)\n}`);

    parser.setInput("{int a; {bool a;}}");
    expect(postfix(parser.program())).toBe(`{\nint (a)\n{\nbool (a)\n}\n}`);

    parser.setInput("{int a; {bool a;} {real b;}}");
    expect(postfix(parser.program())).toBe(`{\nint (a)\n{\nbool (a)\n}\n{\nreal (b)\n}\n}`);
  })

  it("should parse function calls", () => {
    parser.setInput("foo();");
    expect(postfix(parser.program())).toBe("foo()");
    parser.setInput("foo(a);");
    expect(postfix(parser.program())).toBe("foo( (a) )");
    parser.setInput("foo(a,b);");
    expect(postfix(parser.program())).toBe("foo( (a) , (b) )");
    parser.setInput("foo(a+b*c, 32**4);");
    expect(postfix(parser.program())).toBe("foo( (a b c * +) , (32 4 **) )");
    parser.setInput("foo(foo());");
    expect(postfix(parser.program())).toBe("foo( (foo()) )");
  })

  it("should parse function definitions", () => {
    parser.setInput(`
    void foo(){
      int a;
      a = a + 1;
      int bcd = a;
    }`);
    expect(postfix(parser.program())).toBe("void foo(){\nint (a)\na = a 1 +\nint (bcd = a)\n}");

    parser.setInput(`int foo(int a, int b, int c){
      return a + b + c;
    }`);

    expect(postfix(parser.program())).toBe(`int foo( int (a), int (b), int (c)){\nreturn a b + c +\n}`);
  })

  it("should parse conditional compounds", () => {
    parser.setInput("if(a>b){\nreal c;}");
    expect(postfix(parser.program())).toBe("if(a b >){\nreal (c)\n}");

    parser.setInput("if(a>b){\nreal c;}\nelse{real d;}");
    expect(postfix(parser.program())).toBe("if(a b >){\nreal (c)\n}else{\nreal (d)\n}");

    parser.setInput("if(a>b){\nreal c;}\nelif(a==b){\nreal d;}\nelse{\nreal e;}");
    expect(postfix(parser.program())).toBe("if(a b >){\nreal (c)\n}elif(a b ==){\nreal (d)\n}else{\nreal (e)\n}");
  })

  it("should not allow to have missing operands", () => {
    parser.setInput("1-;");
    expect(()=>{parser.program()}).toThrowError();
    parser.setInput("1*2//3;");
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
