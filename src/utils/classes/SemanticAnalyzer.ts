import { TokenKind, isTokenArithmeticOperator, isTokenEqualityOperator, isTokenLiteral, isTokenLogicalOperator, isTokenRelationalOperator } from "../constants/tokenKinds";
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
      return symbol.type;
    }

    throw new Error(`Symbol "${ast.getChildren()[0]?.getToken().str}" is undefined`);
  }

  public validateEqualityOperationType(ast :AbstractSyntaxTree) :string{
    const leftChild = ast.getChildren()[0];
    const rightChild = ast.getChildren()[1];
    
    if(this.getExpressionType(leftChild!) === this.getExpressionType(rightChild!)) return "bool";

    throw new Error(`Operator <${TokenKind[ast.getToken().type]}:"${ast.getToken().str}"> at row:${ast.getToken().row} col:${ast.getToken().col} cannot operate over different types`);
  }

  public validateOperation(ast: AbstractSyntaxTree, childrenTypes: string[], returnType: string) :string{
    const isValid = ast.getChildren().every((child)=>{
      const expType = this.getExpressionType(child!);
      return childrenTypes.some((type) => type === expType);
    })

    if(isValid) return returnType;

    throw new Error(`Operator <${TokenKind[ast.getToken().type]}:"${ast.getToken().str}"> at row:${ast.getToken().row} col:${ast.getToken().col} cannot operate over other types than ${childrenTypes.reduce((str, type) => str + "<" + type + "> " )}`);
  }

  private getExpressionType(ast :AbstractSyntaxTree) :string{
    const astKind = ast.getToken().type
    if(isTokenArithmeticOperator(astKind)){
      return this.validateOperation(ast, ["real"], "real");
    }
    if(isTokenEqualityOperator(astKind)){
      return this.validateEqualityOperationType(ast);
    }
    if(isTokenRelationalOperator(astKind)){
      return this.validateOperation(ast, ["real"], "bool");
    }
    if(isTokenLogicalOperator(astKind)){
      return this.validateOperation(ast, ["bool"], "bool");
    }
    if(isTokenLiteral(astKind)){
      return this.getLiteralType(ast);
    }
    if(astKind === TokenKind.SYMBOL){
      return this.getSymbolType(ast);
    }

    throw new Error(`TYPE_CHECKING: Expression expected at row: ${ast.getToken().row} col: ${ast.getToken().col}. Got <${TokenKind[astKind]}:${ast.getToken().str}>`);
    
  }

  private analyzeVariableAssigment(varAssign: BinaryOperatorSyntaxTree, type: string): void{
    const expressionType = this.getExpressionType(varAssign.getChildren()[1]!);
    if(expressionType !== type){
      const varToken = varAssign.getChildren()[0]!.getToken();
      throw new Error(`Type missmatch on assignment of variable "${varToken.str}" at row: ${varToken.row} col: ${varToken.col}. Expected <${type}>, got <${expressionType}>`);
    }
  }

  private analyzeVariableDeclaration (varDeclST: VariableDeclarationSyntaxTree): void {
    const type = varDeclST.getToken().str;
    varDeclST.getChildren()
    .forEach((child)=>{
      let name = child!.getToken().str;

      if(child instanceof BinaryOperatorSyntaxTree){
        name = child.getChildren()[0]!.getToken().str;
        this.analyzeVariableAssigment(child, type);
      }
      
      this.symbolTable.addSymbol(name, type, child!, this.currentScope);
    });
  }

  public analyze(program :ProgramSyntaxTree): void{
    this.symbolTable.removeSymbolsOfScope(0);

    program.getChildren().forEach((child)=>{
      if(child instanceof VariableDeclarationSyntaxTree){
        this.analyzeVariableDeclaration(child);
      }
      else if(child!.getToken().type === TokenKind.ASSIGN){
        const variable = child!.getChildren()[0]!;
        
        this.analyzeVariableAssigment(child as BinaryOperatorSyntaxTree, this.getSymbolType(variable));
      }
      else if(child instanceof BinaryOperatorSyntaxTree || child instanceof UnaryOperatorSyntaxTree){
        this.getExpressionType(child);
      }
    })
  }
}