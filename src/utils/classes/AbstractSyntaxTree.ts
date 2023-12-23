export abstract class AbstractSyntaxTree {
  protected token: string;
  protected children: (AbstractSyntaxTree | null)[];

  constructor(token: string, children: (AbstractSyntaxTree | null)[]) {
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
  public abstract evaluate(): number;
  public abstract postfix(): string;
}
