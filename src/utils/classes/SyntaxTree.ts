import { SyntaxTreeKind } from "../constants/syntaxTreeKinds";
import { Token } from "./Tokenizer";


export class SyntaxTree {
  protected token: Token;
  protected children: (SyntaxTree)[];
  protected kind: SyntaxTreeKind;

  constructor(kind: SyntaxTreeKind, token: Token, children: (SyntaxTree)[]) {
    this.kind = kind;
    this.token = token;
    this.children = children;
  }

  public getChildren() {
    return this.children;
  }

  public getToken() {
    return this.token;
  }
  
  public getKind(){
    return this.kind;
  }
}