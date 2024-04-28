import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class FunctionCallSyntaxTree extends AbstractSyntaxTree {
    public postfix() {
      let str = "";
      this.children.forEach((node, index)=>{
        str += (index > 0? "," : "") + " (" + node.postfix() + ") ";
      })

      return this.token.str + "(" + str + ")";
    }
  }
  