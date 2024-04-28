import { TokenKind, isTokenEqualityOperator, isTokenLiteral, isTokenRelationalOperator, isTokenUnaryOperator } from "../constants/tokenKinds";
import Tokenizer from "./Tokenizer";
import { SyntaxTree } from "./SyntaxTree";
import { SyntaxTreeKind } from "../constants/syntaxTreeKinds";

export default class Parser {
  private tokenizer: Tokenizer;
  
  constructor(input: string = "") {
    this.tokenizer = new Tokenizer(input);
  }
  
  public setInput(input: string) {
    this.tokenizer.setInput(input);
  }
  
  private eat(token: TokenKind) {
    const currToken = this.tokenizer.getCurrentToken();
    if (currToken.kind !== token) {
      throw new Error(
        `<${TokenKind[token]}> expected at row: "${currToken.row}" col: "${currToken.col}". Got <${TokenKind[currToken.kind]}>("${currToken.str}") instead.`
      );
    }
    this.tokenizer.advance();
  }
  
  public program(): SyntaxTree {
    const token = this.tokenizer.advance();
    const children: SyntaxTree[] = [];
  
    while(this.tokenizer.getCurrentToken().kind !== TokenKind.EOF)
    {
      if(this.tokenizer.getCurrentToken().kind === TokenKind.L_BRACE){
        children.push(this.block());
      }
      else if(
        this.tokenizer.peekToken(0).kind === TokenKind.SYMBOL &&
        this.tokenizer.peekToken(1).kind === TokenKind.SYMBOL &&
        this.tokenizer.peekToken(2).kind === TokenKind.L_PARENTHESIS
      ){
        children.push(this.functionDefinition());
      }
      else {
        children.push(this.sentence());
      }
    }
  
    return new SyntaxTree(SyntaxTreeKind.PROGRAM, token, children);
  }

  private functionDefinition(): SyntaxTree{
    const retType = this.tokenizer.advance();
    const identifier = new SyntaxTree(SyntaxTreeKind.VARIABLE, this.tokenizer.advance(), []);

    return new SyntaxTree(SyntaxTreeKind.FUNCTION_DEFINITION, retType, [identifier, this.functionParametersDefinition(), this.block()]);
  }

  private functionParametersDefinition(): SyntaxTree{
    const token = this.tokenizer.getCurrentToken();
    const children: SyntaxTree[] = [];

    this.eat(TokenKind.L_PARENTHESIS);

    let parametersLeft :boolean = this.tokenizer.getCurrentToken().kind !== TokenKind.R_PARENTHESIS;

    while(parametersLeft){
      const parameter = new SyntaxTree(SyntaxTreeKind.VARIABLE_DEFINITION, this.tokenizer.advance(), [new SyntaxTree(SyntaxTreeKind.VARIABLE, this.tokenizer.advance(), [])]);
      
      children.push(parameter);
      if(this.tokenizer.getCurrentToken().kind === TokenKind.COMMA){
        parametersLeft = true;
        this.tokenizer.advance();
      }else{
        parametersLeft = false;
      }
    }

    this.eat(TokenKind.R_PARENTHESIS);

    return new SyntaxTree(SyntaxTreeKind.FUNCTION_PARAMETERS_DEFINITION, token, children);
  }
  
  private block(): SyntaxTree {
    const token = this.tokenizer.advance();
    const children: SyntaxTree[] = []; 

    while(this.tokenizer.getCurrentToken().kind !== TokenKind.R_BRACE){
      if (this.tokenizer.getCurrentToken().kind === TokenKind.EOF){
        throw new Error(
          `<${TokenKind[TokenKind.R_BRACE]}>:"}" expected.`
        );
      }

      if(this.tokenizer.getCurrentToken().kind === TokenKind.L_BRACE){
        children.push(this.block());
      }else{
        children.push(this.sentence());
      }
    }

    this.tokenizer.advance();
    return new SyntaxTree(SyntaxTreeKind.BLOCK, token, children);
  }

  private sentence(): SyntaxTree {
    let root;

    if(this.tokenizer.peekToken(0).kind === TokenKind.SYMBOL &&
      this.tokenizer.peekToken(1).kind === TokenKind.ASSIGN){
        root = this.variableAssignment()
    }
    else if(this.tokenizer.peekToken(0).kind === TokenKind.SYMBOL &&
      this.tokenizer.peekToken(1).kind === TokenKind.SYMBOL){
        root = this.variableDefinition()
    }
    else if(this.tokenizer.peekToken(0).kind === TokenKind.RETURN){
        root = new SyntaxTree(SyntaxTreeKind.RETURN, this.tokenizer.advance(), [this.expression()]);
    }
    else{
      root = this.expression()
    }

    this.eat(TokenKind.SEMI);
    return root;
  }

  private variableDefinition() : SyntaxTree {
    const token = this.tokenizer.getCurrentToken();
    const children: SyntaxTree[] = [];
    
    do{
      this.tokenizer.advance();

      if(this.tokenizer.peekToken(1).kind === TokenKind.ASSIGN){
        children.push(this.variableAssignment());
      }else{
        children.push(new SyntaxTree(SyntaxTreeKind.VARIABLE, this.tokenizer.advance(), []))
      }
    }while(this.tokenizer.getCurrentToken().kind === TokenKind.COMMA)

    return new SyntaxTree(SyntaxTreeKind.VARIABLE_DEFINITION, token, children);
  }

  private variableAssignment(): SyntaxTree {
    let root = new SyntaxTree(SyntaxTreeKind.VARIABLE, this.tokenizer.advance(), []);
    
    root = new SyntaxTree(SyntaxTreeKind.BINARY_OPERATOR, this.tokenizer.advance(), [root, this.expression()])

    return root;
  }

  private expression(): SyntaxTree {
    return this.disjunction();
  }
  
  private disjunction(): SyntaxTree {
    let root = this.conjunction();

    while (this.tokenizer.getCurrentToken().kind === TokenKind.OR) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.conjunction()]
      );
    }

    return root;
  }

  private conjunction(): SyntaxTree {
    let root = this.equality();

    while (this.tokenizer.getCurrentToken().kind === TokenKind.AND) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.equality()]
      );
    }

    return root;
  }

  private equality(): SyntaxTree {
    let root = this.relation();

    while (isTokenEqualityOperator(this.tokenizer.getCurrentToken().kind)) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.relation()]
      );
    }

    return root;
  }

  private relation(): SyntaxTree {
    let root = this.arithmeitcExpression();

    if (isTokenRelationalOperator(this.tokenizer.getCurrentToken().kind)) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.arithmeitcExpression()]
      );
    }

    return root;
  }

  private arithmeitcExpression(): SyntaxTree {
    let root = this.term();
    
    while (
      this.tokenizer.getCurrentToken().kind === TokenKind.PLUS ||
      this.tokenizer.getCurrentToken().kind === TokenKind.MINUS
    ) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.term()]
      );
    }

    return root;
  }

  private term(): SyntaxTree {
    let root = this.factor();

    while (
      this.tokenizer.getCurrentToken().kind === TokenKind.MUL ||
      this.tokenizer.getCurrentToken().kind === TokenKind.DIV
    ) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.factor()]
      );
    }

    return root;
  }

  private factor(): SyntaxTree {
    let root = this.basePower();

    while (this.tokenizer.getCurrentToken().kind === TokenKind.POWER) {
      root = new SyntaxTree(
        SyntaxTreeKind.BINARY_OPERATOR,
        this.tokenizer.advance(),
        [root, this.factor()]
      );
    }

    return root;
  }

  private basePower(): SyntaxTree {
    const currToken = this.tokenizer.getCurrentToken();
    
    if (isTokenUnaryOperator(currToken.kind)) {
      this.tokenizer.advance();
      return new SyntaxTree(SyntaxTreeKind.UNARY_OPERATOR, currToken, [this.basePower()]);
    }
    if (isTokenLiteral(currToken.kind)) {
      this.tokenizer.advance();
      return new SyntaxTree(SyntaxTreeKind.LITERAL, currToken, []);
    }
    if (currToken.kind === TokenKind.L_PARENTHESIS) {
      this.tokenizer.advance();
      const root = this.expression();
      this.eat(TokenKind.R_PARENTHESIS);
      return root;
    }
    if (currToken.kind === TokenKind.SYMBOL){
      if(this.tokenizer.peekToken(1).kind === TokenKind.L_PARENTHESIS){
        return this.functionCall();
      }else{
        this.tokenizer.advance();
        return new SyntaxTree(SyntaxTreeKind.VARIABLE, currToken, []);
      }
    }

    throw new Error(
      `Expression expected at row: "${currToken.row}" col: "${currToken.col}". Got <${TokenKind[currToken.kind]}>("${currToken.str}") instead."`
    );
  }

  private functionCall() : SyntaxTree {
    const token = this.tokenizer.advance();
    const children: SyntaxTree[] = [];

    this.eat(TokenKind.L_PARENTHESIS);

    let parametersLeft :boolean = this.tokenizer.getCurrentToken().kind !== TokenKind.R_PARENTHESIS;

    while(parametersLeft){
      children.push(this.expression());

      if(this.tokenizer.getCurrentToken().kind === TokenKind.COMMA){
        parametersLeft = true;
        this.tokenizer.advance();
      }else{
        parametersLeft = false;
      }
    }

    this.eat(TokenKind.R_PARENTHESIS);

    return new SyntaxTree(SyntaxTreeKind.FUNCTION_CALL, token, children);
  }
}
