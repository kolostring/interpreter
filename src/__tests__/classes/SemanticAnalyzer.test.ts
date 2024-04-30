import { describe, expect, it } from "vitest";
import SemanticAnalyzer from "../../utils/classes/SemanticAnalyzer";
import Parser from "../../utils/classes/Parser";

const semanticAnalyzer = new SemanticAnalyzer();
const parser = new Parser();

describe("Semantic Analyzer", ()=>{
  it("should allow to relate arithmetic operations", ()=>{
    parser.setInput("(1+2+3) > (45*(90**2));");
    semanticAnalyzer.analyze(parser.program());
  });

  it("should allow equality operations", ()=>{
    parser.setInput("(1+2+3) == (45);");
    semanticAnalyzer.analyze(parser.program());
    
    parser.setInput("!(1+2+3 > 4) == (56 == 78);");
    semanticAnalyzer.analyze(parser.program());
  });

  it("should allow conditional compounds", ()=>{
    parser.setInput("if(true){\nreal a;\n}else{real b;}");
    semanticAnalyzer.analyze(parser.program());

    parser.setInput("if(12 > 3){\nreal a;\n}elif(12==3){\nreal b;}else{\nreal c;}");
    semanticAnalyzer.analyze(parser.program());
  })

  it("should not allow arithmetic operators to operate over any type other than real", ()=>{
    parser.setInput("123+true;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  });

  it("should not allow relational operators to operate over any type other than real", () => {
    parser.setInput("true > 123;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  });

  it("should not allow not operator to operate over any type other than bool", () => {
    parser.setInput("!123;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  });

  it("should not allow equality operators to operate over different types", () => {
    parser.setInput("false == 123;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  });
  
  it("should allow to assign values to a symbol", () => {
    parser.setInput("bool a = (123 * 56 > 78);");
    semanticAnalyzer.analyze(parser.program());

    parser.setInput("real a; a = 123**45;");
    semanticAnalyzer.analyze(parser.program());

    parser.setInput("bool a; a = 123 / 4 < 5 && 67 > 90 == false;");
    semanticAnalyzer.analyze(parser.program());
  })

  it("should allow to redefine a symbol on different scope", () => {
    parser.setInput("real a; {bool a;}");
    semanticAnalyzer.analyze(parser.program());

    parser.setInput("real a; {bool a; {real a;}}");
    semanticAnalyzer.analyze(parser.program());
  })

  it("should not allow to redefine a symbol on same scope", () => {
    parser.setInput("real a;\nbool a;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();

    parser.setInput("real a, b = 32, a, c, d;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  })

  it("should not allow to assign wrong type to a symbol", () => {
    parser.setInput("real a = true;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();

    parser.setInput("bool a; a = 123 / 45 ** 67;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  })

  it("should not allow to assign to undefined variables", () => {
    parser.setInput("a = true;");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  })

  it("should not allow non boolean expressions as conditions", ()=> {
    parser.setInput("if(123 + 2){\nreal a;\n}");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
    parser.setInput("real a;if(a > 3){\nreal b;\n}elif(a + 4){\nreal b;}");
    expect(()=>semanticAnalyzer.analyze(parser.program())).toThrowError();
  })
})