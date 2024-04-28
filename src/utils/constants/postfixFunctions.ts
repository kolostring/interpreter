import { SyntaxTree } from "../classes/SyntaxTree";
import { SyntaxTreeKind } from "./syntaxTreeKinds";

const postfixFunctions : Record<SyntaxTreeKind, (syntaxTree: SyntaxTree) => string> = {
  [SyntaxTreeKind.PROGRAM]: (syntaxTree) =>{
    return syntaxTree.getChildren().reduce((acc: string, child, index)=>{
      return acc + (index > 0? "\n" : "") + (postfix(child));
    }, "");
  },
  [SyntaxTreeKind.IF]: (syntaxTree) =>{
    return syntaxTree.getToken().str + "(" + postfix(syntaxTree.getChildren()[0]) + ")" + postfix(syntaxTree.getChildren()[1]) + (syntaxTree.getChildren()[2] === undefined ? "" : postfix(syntaxTree.getChildren()[2]));
  },
  [SyntaxTreeKind.ELSE]: (syntaxTree) =>{
    return syntaxTree.getToken().str + postfix(syntaxTree.getChildren()[0]);
  },
  [SyntaxTreeKind.FUNCTION_DEFINITION]: (syntaxTree) =>{
    return syntaxTree.getToken().str + " " + postfix(syntaxTree.getChildren()[0]) + postfix(syntaxTree.getChildren()[1]) + postfix(syntaxTree.getChildren()[2]);
  },
  [SyntaxTreeKind.FUNCTION_PARAMETERS_DEFINITION]: (syntaxTree) =>{
    return "(" + syntaxTree.getChildren().reduce((acc: string, child, index)=>{
      return acc + (index > 0? ", " : " ") + (postfix(child));
    }, "") + ")";
  },
  [SyntaxTreeKind.BLOCK]: (syntaxTree) =>{
    return "{\n" + syntaxTree.getChildren().reduce((acc: string, child)=>{
      return acc + (postfix(child)) + "\n";
    }, "") + "}";
  },
  [SyntaxTreeKind.RETURN]: (syntaxTree) =>{
    return syntaxTree.getToken().str + " " + postfix(syntaxTree.getChildren()[0]);
  },
  [SyntaxTreeKind.VARIABLE_DEFINITION]: (syntaxTree) =>{
    return syntaxTree.getToken().str + syntaxTree.getChildren().reduce((acc: string, child, index)=>{
      return acc + (index > 0 ? "," : "") + " (" + (postfix(child)) + ")";
    }, "");
  },
  [SyntaxTreeKind.VARIABLE]: (syntaxTree) =>{
    return syntaxTree.getToken().str;
  },
  [SyntaxTreeKind.BINARY_OPERATOR]: (syntaxTree) =>{
    return `${postfix(syntaxTree.getChildren()[0])} ${postfix(syntaxTree.getChildren()[1])} ${syntaxTree.getToken().str}`;
  },
  [SyntaxTreeKind.UNARY_OPERATOR]: (syntaxTree) =>{
    return `${postfix(syntaxTree.getChildren()[0])} (${syntaxTree.getToken().str})`;
  },
  [SyntaxTreeKind.FUNCTION_CALL]: (syntaxTree) =>{
    return syntaxTree.getToken().str + "(" + syntaxTree.getChildren().reduce((acc: string, child, index)=>{
      return acc + (index > 0 ? "," : "") + " (" + (postfix(child)) + ") ";
    }, "") + ")";
  },
  [SyntaxTreeKind.LITERAL]: (syntaxTree) =>{
    return syntaxTree.getToken().str;
  },
}

export default function postfix(syntaxTree :SyntaxTree): string{
  return postfixFunctions[syntaxTree.getKind()](syntaxTree);
}