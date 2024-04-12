import { Token } from "../Tokenizer";

export abstract class AbstractSyntaxTree {
  protected token: Token;
  protected children: (AbstractSyntaxTree)[];

  constructor(token: Token, children: (AbstractSyntaxTree)[]) {
    this.token = token;
    this.children = children;
  }

  public getChildren() {
    return this.children;
  }

  public getToken() {
    return this.token;
  }

  public abstract postfix(): string;
}
