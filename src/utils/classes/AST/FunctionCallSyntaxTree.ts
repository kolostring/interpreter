import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { VariableSyntaxTree } from "./VariableSyntaxTree";

export class FunctionCallSyntaxTree extends AbstractSyntaxTree {
    constructor(token: Token) {
      super(token, []);
    }
    
    public addChild(child :VariableSyntaxTree){
        this.children.push(child);
      }

    public postfix() {
      let str = "";
      this.children.forEach((node, index)=>{
        str += (index > 0? "," : "") + " (" + node?.postfix() + ") ";
      })

      return this.token.str + "(" + str + ")";
    }
  }
  