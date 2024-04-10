import { describe, expect, it } from "vitest";
import SemanticAnalyzer from "../../utils/classes/SemanticAnalyzer";
import Parser from "../../utils/classes/Parser";
import { ProgramSyntaxTree } from "../../utils/classes/AST/ProgramSyntaxTree";

const semanticAnalyzer = new SemanticAnalyzer();
const parser = new Parser();

describe("Semantic Analyzer", ()=>{
  it("should not allow to redefine a symbol", ()=>{
    parser.setInput(`real a;\nbool a;`);
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();

    parser.setInput(`real a, b = 32, a, c, d;`);
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();
  })

  it("should allow to relate arithmetic operations", ()=>{
    parser.setInput("(1+2+3) > (45*(90**2));");
    semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree);
  });

  it("should allow equality operations", ()=>{
    parser.setInput("(1+2+3) == (45);");
    semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree);
    
    parser.setInput("!(1+2+3 > 4) == (56 == 78);");
    semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree);
  });

  it("should not allow arithmetic operators to operate over any type other than real", ()=>{
    parser.setInput("123+true;");
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();
  });

  it("should not allow relational operators to operate over any type other than real", () => {
    parser.setInput("true > 123;");
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();
  });

  it("should not allow not operator to operate over any type other than bool", () => {
    parser.setInput("!123;");
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();
  });

  it("should not allow equality operators to operate over different types", () => {
    parser.setInput("false == 123;");
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();
  });
  
})