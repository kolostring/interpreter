import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./BinaryOperatorSyntaxTree";
import { VariableSyntaxTree } from "./VariableSyntaxTree";

export class VariableDeclarationSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token) {
    super(token, []);
  }
  
  public addChild(child :VariableSyntaxTree | BinaryOperatorSyntaxTree){
    this.children.push(child);
  }

  public postfix(): string {
    let pfx = "";

    this.children.forEach((node, index)=>{
      pfx += (index > 0 ? "," : "") + " (" + (node?.postfix()) + ")";
    })

    return this.token.str + pfx;
  }
}
