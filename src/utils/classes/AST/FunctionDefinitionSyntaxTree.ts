import { Token } from "../Tokenizer";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { BlockSyntaxTree } from "./BlockSyntaxTree";
import { FunctionParametersDefinitionSyntaxTree } from "./FunctionParametersDefinitionSyntaxTree";
import { VariableSyntaxTree } from "./VariableSyntaxTree";

export class FunctionDefinitionSyntaxTree extends AbstractSyntaxTree {
    constructor(token: Token, identifier: VariableSyntaxTree, parameters: FunctionParametersDefinitionSyntaxTree, block: BlockSyntaxTree) {
      super(token, [identifier, parameters, block]);
    }
    
    public postfix() {
      return this.token.str + " " + this.children[0]?.postfix() + this.children[1]?.postfix() + this.children[2]?.postfix();
    }
  }
  