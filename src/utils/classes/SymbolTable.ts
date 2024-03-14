import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";

export type SymbolType = {
  name: string;
  scope: number;
  ast: AbstractSyntaxTree;
};

export default class SymbolTable {
  private symbols: SymbolType[] = [];

  public findSymbol(symbolName: string): SymbolType | undefined {
    return this.symbols.find((symb) => symb.name === symbolName);
  }

  public addSymbol(symbol: SymbolType): void {
    const foundSymbol = this.findSymbol(symbol.name);
    if(foundSymbol === undefined){
      this.symbols.push(symbol);
    }else{
      throw new Error(`Redefinition of Symbol: "${foundSymbol.name}".\nInitial Definition at row: ${foundSymbol.ast.getToken().row}, col: ${foundSymbol.ast.getToken().col}\nRedefinition at row: ${symbol.ast.getToken().row}, col: ${symbol.ast.getToken().col}`);
    }
  }

  public removeSymbolsOfScope(scope: number): void{
    this.symbols = this.symbols.filter((symbol)=>symbol.scope < scope);
  }
}
