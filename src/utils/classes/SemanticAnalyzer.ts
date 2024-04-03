import { TokenKind, isTokenArithmeticOperator, isTokenEqualityOperator, isTokenLiteral, isTokenRelationalOperator } from "../constants/tokenKinds";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./AST/BinaryOperatorSyntaxTree";
import { LiteralSyntaxTree } from "./AST/LiteralSyntaxTree";
import { ProgramSyntaxTree } from "./AST/ProgramSyntaxTree";
import { UnaryOperatorSyntaxTree } from "./AST/UnaryOperatorSyntaxTree";
import { VariableDeclarationSyntaxTree } from "./AST/VariableDeclarationSyntaxTree";
import SymbolTable from "./SymbolTable";

export default class SemanticAnalyzer{
  private symbolTable: SymbolTable = new SymbolTable();
  private currentScope: number = 0;

  private getLiteralType(literal :LiteralSyntaxTree){
    switch(literal.getToken().type){
      case TokenKind.NUMBER:
        return "real";
      case TokenKind.FALSE:
      case TokenKind.TRUE:
        return "bool";
      default:
        return "undefined";
    }
  }

  public getSymbolType(ast :AbstractSyntaxTree) :string{
    const symbol = this.symbolTable.findSymbolByName(ast.getToken().str);
    if(symbol !== undefined){
      return symbol.ast.getToken().str;
    }

    throw new Error(`Symbol "${ast.getChildren()[0]?.getToken().str}" is undefined`);
  }

  public validateArithmeticOperationType(ast :AbstractSyntaxTree) :string{
    const isValid = ast.getChildren().every((child)=>child !== null && this.getExpressionType(child) === "real");
    if(isValid) return "real";

    throw new Error(`Operator <${TokenKind[ast.getToken().type]}:"${ast.getToken().str}"> at row:${ast.getToken().row} col:${ast.getToken().col} cannot operate over other types than "real"`);
  }

  public validateEqualityOperationType(ast :AbstractSyntaxTree) :string{
    const leftChild = ast.getChildren()[0];
    const rightChild = ast.getChildren()[1];
    
    if(this.getExpressionType(leftChild!) === this.getExpressionType(rightChild!)) return "bool";

    throw new Error(`Operator <${TokenKind[ast.getToken().type]}:"${ast.getToken().str}"> at row:${ast.getToken().row} col:${ast.getToken().col} cannot operate over different types`);
  }

  public validateNotOperatorType(ast :AbstractSyntaxTree) :string{
    const child = ast.getChildren()[0];
    
    if(this.getExpressionType(child!) === "bool") return "bool";

    throw new Error(`Operator <${TokenKind[ast.getToken().type]}:"${ast.getToken().str}"> at row:${ast.getToken().row} col:${ast.getToken().col} cannot operate over other types than "bool"`);
  }

  public validateRelationalOperationType(ast :AbstractSyntaxTree) :string{
    const isValid = ast.getChildren().every((child)=>child !== null && this.getExpressionType(child) === "real");
    if(isValid) return "bool";

    throw new Error(`Operator <${TokenKind[ast.getToken().type]}:"${ast.getToken().str}"> at row:${ast.getToken().row} col:${ast.getToken().col} cannot operate over other types than "real"`);
  }

  private getExpressionType(ast :AbstractSyntaxTree) :string{
    const astKind = ast.getToken().type
    if(isTokenArithmeticOperator(astKind)){
      return this.validateArithmeticOperationType(ast);
    }
    if(isTokenEqualityOperator(astKind)){
      return this.validateEqualityOperationType(ast);
    }
    if(isTokenRelationalOperator(astKind)){
      return this.validateRelationalOperationType(ast);
    }
    if(astKind === TokenKind.NOT){
      return this.validateNotOperatorType(ast);
    }
    if(isTokenLiteral(astKind)){
      return this.getLiteralType(ast);
    }
    if(astKind === TokenKind.SYMBOL){
      return this.getSymbolType(ast);
    }

    throw new Error(`TYPE_CHECKING: Expression expected at row: ${ast.getToken().row} col: ${ast.getToken().col}. Got <${TokenKind[astKind]}:${ast.getToken().str}>`);
    
  }

  private analyzeVariableDeclaration(varDeclST: VariableDeclarationSyntaxTree){
    const varSymbol = {scope: this.currentScope, ast: varDeclST};
    this.symbolTable.addSymbol(varSymbol);
  }

  public analyze(program :ProgramSyntaxTree): void{
    program.getChildren().forEach((child)=>{
      if(child instanceof VariableDeclarationSyntaxTree){
        this.analyzeVariableDeclaration(child);
      }
      if(child instanceof BinaryOperatorSyntaxTree || child instanceof UnaryOperatorSyntaxTree){
        this.getExpressionType(child);
      }
    })
  }
}