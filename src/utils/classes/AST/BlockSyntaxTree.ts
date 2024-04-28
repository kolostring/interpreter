import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class BlockSyntaxTree extends AbstractSyntaxTree {
  public postfix(): string {
    let pfx = "";

    this.children.forEach((node)=>{
      pfx += (node.postfix()) + "\n";
    })

    return "{\n" + pfx + "}";
  }
}
