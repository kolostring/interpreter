import { Token } from "../Tokenizer";

export abstract class AbstractSyntaxTree {
  protected token: Token;
  protected children: (AbstractSyntaxTree | null)[];

  constructor(token: Token, children: (AbstractSyntaxTree | null)[]) {
    this.token = token;
    this.children = children;
  }

  public getToken() {
    return this.token;
  }

  public abstract evaluate(): number | boolean;
  public abstract postfix(): string;
}
