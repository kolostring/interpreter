import { Token } from "../Tokenizer";

export abstract class AbstractSyntaxTree {
  protected token: Token;
  protected children: (AbstractSyntaxTree | null)[];

  constructor(token: Token, children: (AbstractSyntaxTree | null)[]) {
    this.token = token;
    this.children = children;
  }

  public getNode(index: number) {
    return this.children[index];
  }

  public getToken() {
    return this.token;
  }

  public abstract insertChild(child: AbstractSyntaxTree): void;
  public abstract evaluate(): number | boolean;
  public abstract postfix(): string;
}
