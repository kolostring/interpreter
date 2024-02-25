import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class ProgramSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token) {
    super(token, []);
  }
  
  public addChild(child :AbstractSyntaxTree){
    this.children.push(child);
  }

  public postfix(): string {
    let pfx = "";

    this.children.forEach((node, index)=>{
      pfx += (index > 0? "\n" : "") + (node?.postfix());
    })

    return pfx;
  }
}
