import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { VariableDeclarationSyntaxTree } from "./VariableDeclarationSyntaxTree";

export class FunctionParametersDefinitionSyntaxTree extends AbstractSyntaxTree {
    constructor(token: Token) {
      super(token, []);
    }

    public addChild(child :VariableDeclarationSyntaxTree){
      this.children.push(child);
    }
    
    public postfix(): string {
      let pfx = "";
  
      this.children.forEach((node, index)=>{
        pfx += (index > 0 ? ", " : " ") + (node.postfix());
      })
  
      return "(" + pfx + ")";
    }
  }
  