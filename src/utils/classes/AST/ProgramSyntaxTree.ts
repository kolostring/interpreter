import { AbstractSyntaxTree } from "./AbstractSyntaxTree";

export class ProgramSyntaxTree extends AbstractSyntaxTree {
  public postfix(): string {
    let pfx = "";

    this.children.forEach((node, index)=>{
      pfx += (index > 0? "\n" : "") + (node.postfix());
    })

    return pfx;
  }
}
