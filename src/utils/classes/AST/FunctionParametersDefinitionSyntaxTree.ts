import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class FunctionParametersDefinitionSyntaxTree extends AbstractSyntaxTree {
  
    public postfix(): string {
      let pfx = "";
  
      this.children.forEach((node, index)=>{
        pfx += (index > 0 ? ", " : " ") + (node.postfix());
      })
  
      return "(" + pfx + ")";
    }
  }
  