import { builtInTypes } from "../constants/builtinTypes";
import { SyntaxTreeKind } from "../constants/syntaxTreeKinds";
import { TokenKind, isTokenArithmeticOperator, isTokenEqualityOperator, isTokenLiteral, isTokenLogicalOperator, isTokenRelationalOperator } from "../constants/tokenKinds";
import SymbolTable from "./SymbolTable";
import { SyntaxTree } from "./SyntaxTree";

export default class SemanticAnalyzer{
  private symbolTable: SymbolTable = new SymbolTable();
  private currentScope: number = 0;

  public analyze(program :SyntaxTree): void{
    this.symbolTable.removeSymbolsOfScope(0);

    this.analyzeChildren(program);
  }

  private analyzeChildren(ast :SyntaxTree): void{
    ast.getChildren().forEach((child)=>{
      if(child.getKind() === SyntaxTreeKind.VARIABLE_DEFINITION){
        this.analyzeVariableDefinition(child);
      }
      else if(child.getKind() === SyntaxTreeKind.ASSIGNMENT){
        this.analyzeVariableAssigment(child);
      }
      else if(child.getKind() === SyntaxTreeKind.BINARY_OPERATOR || child.getKind() === SyntaxTreeKind.UNARY_OPERATOR){
        this.getExpressionType(child);
      }
      else if(child.getKind() === SyntaxTreeKind.BLOCK){
        this.analyzeBlock(child);
      }
      else if(child.getKind() === SyntaxTreeKind.IF){
        this.analyzeConditionalCompound(child);
      }
    })
  }

  private analyzeConditionalCompound(conditionalST: SyntaxTree){
    const expression = conditionalST.getChildren()[0];
    const block = conditionalST.getChildren()[1];
    const dependent = conditionalST.getChildren()[2];

    this.checkExpressionType(expression, ["bool"]);
    this.analyzeBlock(block);

    if(dependent === undefined) return;

    if(dependent.getKind() === SyntaxTreeKind.IF){
      this.analyzeConditionalCompound(dependent)
    }else{
      this.analyzeBlock(dependent.getChildren()[0]);
    }
  }

  private analyzeBlock(blockST: SyntaxTree): void {
    this.currentScope++;
    this.analyzeChildren(blockST);
    this.symbolTable.removeSymbolsOfScope(this.currentScope);
    this.currentScope--;
  }

  private analyzeVariableDefinition (varDeclST: SyntaxTree): void {
    const type = varDeclST.getToken().str;

    if(builtInTypes.indexOf(type) === -1){
      const token = varDeclST.getToken();
      throw new Error(`Undefined type "${type}" on row: ${token.row} col: ${token.col}`);
    }

    varDeclST.getChildren()
    .forEach((definition)=>{
      let symbolName = definition.getToken().str;

      if(definition.getKind() === SyntaxTreeKind.ASSIGNMENT){
        symbolName = definition.getChildren()[0].getToken().str;

        this.checkExpressionType(definition.getChildren()[1], [type]);
      }
      
      this.symbolTable.addSymbol(symbolName, type, definition, this.currentScope);
    });
  }

  private analyzeVariableAssigment(varAssign: SyntaxTree): void{
    const symbolName = varAssign.getChildren()[0].getToken().str;
    const symbolType = this.symbolTable.findSymbolByName(symbolName)?.type;
    
    if(symbolType !== undefined){
      this.checkExpressionType(varAssign.getChildren()[1], [symbolType]);
    }
    else{
      const token = varAssign.getChildren()[0].getToken();

      throw new Error(`Undefined Symbol "${symbolName}" at row: ${token.row} col: ${token.col}.`);
    }
  }

  private checkExpressionType(expression: SyntaxTree, expectedTypes: string[]){
    const expressionType = this.getExpressionType(expression);

    if(expectedTypes.indexOf(expressionType) === -1){
      const token = expression.getToken();
      throw new Error(`Type missmatch at row: ${token.row} col: ${token.col}. Expected <${expectedTypes}>, got <${expressionType}>`);
    }
  }

  private getExpressionType(expressionST :SyntaxTree) :string{
    const astKind = expressionST.getToken().kind
    if(isTokenEqualityOperator(astKind)){
      return this.validateEqualityOperation(expressionST);
    }
    if(isTokenArithmeticOperator(astKind)){
      return this.validateOperation(expressionST, ["real"], "real");
    }
    if(isTokenRelationalOperator(astKind)){
      return this.validateOperation(expressionST, ["real"], "bool");
    }
    if(isTokenLogicalOperator(astKind)){
      return this.validateOperation(expressionST, ["bool"], "bool");
    }
    if(isTokenLiteral(astKind)){
      return this.getLiteralType(expressionST);
    }
    if(astKind === TokenKind.SYMBOL){
      return this.getSymbolType(expressionST);
    }

    throw new Error(`TYPE_CHECKING: Expression expected at row: ${expressionST.getToken().row} col: ${expressionST.getToken().col}. Got <${TokenKind[astKind]}:${expressionST.getToken().str}>`);
    
  }

  public validateOperation(operationST: SyntaxTree, childrenTypes: string[], returnType: string) :string{
    const isValid = operationST.getChildren().every((child)=>{
      const expType = this.getExpressionType(child);
      return childrenTypes.some((type) => type === expType);
    })

    if(isValid) return returnType;

    throw new Error(`Operator <${TokenKind[operationST.getToken().kind]}:"${operationST.getToken().str}"> at row:${operationST.getToken().row} col:${operationST.getToken().col} cannot operate over other types than ${childrenTypes.reduce((str, type) => str + "<" + type + "> " )}`);
  }

  public validateEqualityOperation(equalityST :SyntaxTree) :string{
    const leftChild = equalityST.getChildren()[0];
    const rightChild = equalityST.getChildren()[1];
    
    if(this.getExpressionType(leftChild) === this.getExpressionType(rightChild)) return "bool";

    throw new Error(`Operator <${TokenKind[equalityST.getToken().kind]}:"${equalityST.getToken().str}"> at row:${equalityST.getToken().row} col:${equalityST.getToken().col} cannot operate over different types`);
  }

  private getLiteralType(literalST :SyntaxTree){
    switch(literalST.getToken().kind){
      case TokenKind.NUMBER:
        return "real";
      case TokenKind.FALSE:
      case TokenKind.TRUE:
        return "bool";
      default:
        return "undefined";
    }
  }

  public getSymbolType(symbolST :SyntaxTree) :string{
    const symbol = this.symbolTable.findSymbolByName(symbolST.getToken().str);
    if(symbol !== undefined){
      return symbol.type;
    }

    throw new Error(`Undefined Symbol "${symbolST.getToken().str}" at row: ${symbolST.getToken().row} col: ${symbolST.getToken().col}.`);
  }
}