import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class BlockSyntaxTree extends AbstractSyntaxTree {
  constructor(token: Token) {
    super(token, []);
  }
  
  public addChild(child :AbstractSyntaxTree){
    this.children.push(child);
  }

  public postfix(): string {
    let pfx = "";

    this.children.forEach((node)=>{
      pfx += (node.postfix()) + "\n";
    })

    return "{\n" + pfx + "}";
  }
}
