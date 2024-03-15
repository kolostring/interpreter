import { ProgramSyntaxTree } from "./AST/ProgramSyntaxTree";
import { VariableDeclarationSyntaxTree } from "./AST/VariableDeclarationSyntaxTree";
import SymbolTable from "./SymbolTable";

export default class SemanticAnalyzer{
  private symbolTable: SymbolTable = new SymbolTable();
  private currentScope: number = 0;

  private analyzeVariableDeclaration(varDeclST: VariableDeclarationSyntaxTree){
    const varSymbol = {scope: this.currentScope, ast: varDeclST};
    this.symbolTable.addSymbol(varSymbol);
  }

  public analyze(program :ProgramSyntaxTree): void{
    program.getChildren().forEach((child)=>{
      if(child instanceof VariableDeclarationSyntaxTree){
        this.analyzeVariableDeclaration(child);
      }
    })
  }
}