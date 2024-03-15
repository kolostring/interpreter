import { describe, expect, it } from "vitest";
import SemanticAnalyzer from "../../utils/classes/SemanticAnalyzer";
import Parser from "../../utils/classes/Parser";
import { ProgramSyntaxTree } from "../../utils/classes/AST/ProgramSyntaxTree";

const semanticAnalyzer = new SemanticAnalyzer();
const parser = new Parser();

describe("Semantic Analyzer", ()=>{
  it("should not allow to redefine a symbol", ()=>{
    parser.setInput("real a; bool a;");
    expect(()=>semanticAnalyzer.analyze(parser.program() as ProgramSyntaxTree)).toThrowError();
  })
})