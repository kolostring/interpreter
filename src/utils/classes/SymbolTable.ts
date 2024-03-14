import { TokenKind } from "../constants/tokenKinds";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { VariableSyntaxTree } from "./AST/VariableSyntaxTree";

export type SymbolType = {
  scope: number;
  ast: AbstractSyntaxTree;
};

export default class SymbolTable {
  private symbols: SymbolType[] = [];

  public getSymbolName(symbol :SymbolType) :string{
    const fchild = symbol.ast.getChildren()[0];
    const token = symbol.ast.getToken();

    if(fchild === undefined || fchild === null){
      throw new Error(`First child of a Symbol's AST cannot be undefined or null.\nToken: <${TokenKind[token.type]}>: ${token.str}, row: ${token.row}, col: ${token.col}`)
    }
    
    if(fchild instanceof VariableSyntaxTree === false){
      throw new Error(`First child of a Symbol's AST must be a VariableSyntaxTree.\nToken: <${TokenKind[token.type]}>: ${token.str}, row: ${token.row}, col: ${token.col}`)
    }

    return fchild.getToken().str;
  }

  public findSymbolByName(symbolName: string): SymbolType | undefined {
    return this.symbols.find((symb) => this.getSymbolName(symb) === symbolName);
  }

  public findSymbol(symbol: SymbolType): SymbolType | undefined {
    return this.symbols.find((symb) => this.getSymbolName(symb) === this.getSymbolName(symbol));
  }

  public addSymbol(symbol: SymbolType): void {
    const foundSymbol = this.findSymbol(symbol);
    if(foundSymbol === undefined){
      this.symbols.push(symbol);
    }else{
      throw new Error(`Redefinition of Symbol: "${this.getSymbolName(symbol)}".\nInitial Definition at row: ${foundSymbol.ast.getToken().row}, col: ${foundSymbol.ast.getToken().col}\nRedefinition at row: ${symbol.ast.getToken().row}, col: ${symbol.ast.getToken().col}`);
    }
  }

  public removeSymbolsOfScope(scope: number): void{
    this.symbols = this.symbols.filter((symbol)=>symbol.scope < scope);
  }
}
