import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";

export type SymbolType = {
  scope: number;
  name: string;
  type: string;
  ast: AbstractSyntaxTree;
};

export default class SymbolTable {
  private symbols: SymbolType[] = [];

  public findSymbolByName(symbolName: string): SymbolType | undefined {
    return this.symbols.find((symb) => symb.name === symbolName);
  }

  public addSymbol(name: string, type: string, ast: AbstractSyntaxTree, scope: number){
    const foundSymbol = this.findSymbolByName(name);
      if(foundSymbol === undefined || foundSymbol.scope !== scope){
        this.symbols.unshift({name:name, scope: scope, type: type, ast: ast});
      }else{
        throw new Error(`Redefinition of Symbol: "${foundSymbol.name}".\nInitial Definition at row: ${foundSymbol.ast.getToken().row}, col: ${foundSymbol.ast.getToken().col}\nRedefinition at row: ${ast.getToken().row}, col: ${ast.getToken().col}`);
      }
  }

  public removeSymbolsOfScope(scope: number): void{
    this.symbols = this.symbols.filter((symbol)=>symbol.scope < scope);
  }
}
