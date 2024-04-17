import { TokenKind, isTokenEqualityOperator, isTokenLiteral, isTokenRelationalOperator, isTokenUnaryOperator } from "../constants/tokenKinds";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { BinaryOperatorSyntaxTree } from "./AST/BinaryOperatorSyntaxTree";
import { BlockSyntaxTree } from "./AST/BlockSyntaxTree";
import { FunctionCallSyntaxTree } from "./AST/FunctionCallSyntaxTree";
import { FunctionDefinitionSyntaxTree } from "./AST/FunctionDefinitionSyntaxTree";
import { FunctionParametersDefinitionSyntaxTree } from "./AST/FunctionParametersDefinitionSyntaxTree";
import { LiteralSyntaxTree } from "./AST/LiteralSyntaxTree";
import { ProgramSyntaxTree } from "./AST/ProgramSyntaxTree";
import { ReturnStatementSyntaxTree } from "./AST/ReturnStatementSyntaxTree";
import { UnaryOperatorSyntaxTree } from "./AST/UnaryOperatorSyntaxTree";
import { VariableDeclarationSyntaxTree } from "./AST/VariableDeclarationSyntaxTree";
import { VariableSyntaxTree } from "./AST/VariableSyntaxTree";
import Tokenizer from "./Tokenizer";

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

  private basePower(): AbstractSyntaxTree {
    const currToken = this.tokenizer.getCurrentToken();
    
    if (isTokenUnaryOperator(currToken.kind)) {
      this.tokenizer.advance();
      return new UnaryOperatorSyntaxTree(currToken, this.basePower());
    }
    if (isTokenLiteral(currToken.kind)) {
      this.tokenizer.advance();
      return new LiteralSyntaxTree(currToken);
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
        return new VariableSyntaxTree(currToken);
      }
    }

    throw new Error(
      `Expression expected at row: "${currToken.row}" col: "${currToken.col}". Got <${TokenKind[currToken.kind]}>("${currToken.str}") instead."`
    );
  }

  private factor(): AbstractSyntaxTree {
    let root = this.basePower();

    while (this.tokenizer.getCurrentToken().kind === TokenKind.POWER) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.factor()
      );
    }

    return root;
  }

  private term(): AbstractSyntaxTree {
    let root = this.factor();

    while (
      this.tokenizer.getCurrentToken().kind === TokenKind.MUL ||
      this.tokenizer.getCurrentToken().kind === TokenKind.DIV
    ) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.factor()
      );
    }

    return root;
  }

  private arithmeitcExpression(): AbstractSyntaxTree {
    let root = this.term();
    
    while (
      this.tokenizer.getCurrentToken().kind === TokenKind.PLUS ||
      this.tokenizer.getCurrentToken().kind === TokenKind.MINUS
    ) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.term()
      );
    }

    return root;
  }

  private relation(): AbstractSyntaxTree {
    let root = this.arithmeitcExpression();

    if (isTokenRelationalOperator(this.tokenizer.getCurrentToken().kind)) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.arithmeitcExpression()
      );
    }

    return root;
  }

  private equality(): AbstractSyntaxTree {
    let root = this.relation();

    while (isTokenEqualityOperator(this.tokenizer.getCurrentToken().kind)) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.relation()
      );
    }

    return root;
  }

  private conjunction(): AbstractSyntaxTree {
    let root = this.equality();

    while (this.tokenizer.getCurrentToken().kind === TokenKind.AND) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.equality()
      );
    }

    return root;
  }

  private disjunction(): AbstractSyntaxTree {
    let root = this.conjunction();

    while (this.tokenizer.getCurrentToken().kind === TokenKind.OR) {
      root = new BinaryOperatorSyntaxTree(
        this.tokenizer.advance(),
        root,
        this.conjunction()
      );
    }

    return root;
  }

  private expression(): AbstractSyntaxTree {
    return this.disjunction();
  }

  private variableAssignment(): AbstractSyntaxTree {
    let root = new VariableSyntaxTree(this.tokenizer.advance());
    
    root = new BinaryOperatorSyntaxTree(this.tokenizer.advance(), root, this.expression())

    return root;
  }

  private variableDeclaration() : AbstractSyntaxTree {
    const root = new VariableDeclarationSyntaxTree(this.tokenizer.getCurrentToken());
    
    do{
      this.tokenizer.advance();

      if(this.tokenizer.peekToken(1).kind === TokenKind.ASSIGN){
        root.addChild(this.variableAssignment());
      }else{
        root.addChild(new VariableSyntaxTree(this.tokenizer.advance()))
      }
    }while(this.tokenizer.getCurrentToken().kind === TokenKind.COMMA)

    return root;
  }

  private sentence(): AbstractSyntaxTree {
    let root;

    if(this.tokenizer.peekToken(0).kind === TokenKind.SYMBOL &&
      this.tokenizer.peekToken(1).kind === TokenKind.ASSIGN){
        root = this.variableAssignment()
    }
    else if(this.tokenizer.peekToken(0).kind === TokenKind.SYMBOL &&
      this.tokenizer.peekToken(1).kind === TokenKind.SYMBOL){
        root = this.variableDeclaration()
    }
    else if(this.tokenizer.peekToken(0).kind === TokenKind.RETURN){
        root = new ReturnStatementSyntaxTree(this.tokenizer.advance(), this.expression());
    }
    else{
      root = this.expression()
    }

    this.eat(TokenKind.SEMI);
    return root;
  }

  private block(): BlockSyntaxTree {
    const root = new BlockSyntaxTree(this.tokenizer.advance());

    while(this.tokenizer.getCurrentToken().kind !== TokenKind.R_BRACE){
      if (this.tokenizer.getCurrentToken().kind === TokenKind.EOF){
        throw new Error(
          `<${TokenKind[TokenKind.R_BRACE]}>:"}" expected.`
        );
      }

      if(this.tokenizer.getCurrentToken().kind === TokenKind.L_BRACE){
        root.addChild(this.block());
      }else{
        root.addChild(this.sentence());
      }
    }

    this.tokenizer.advance();
    return root;
  }

  private functionParameters(): FunctionParametersDefinitionSyntaxTree{
    const root = new FunctionParametersDefinitionSyntaxTree(this.tokenizer.getCurrentToken());

    this.eat(TokenKind.L_PARENTHESIS);

    let parametersLeft :boolean = this.tokenizer.getCurrentToken().kind !== TokenKind.R_PARENTHESIS;

    while(parametersLeft){
      const parameter = new VariableDeclarationSyntaxTree(this.tokenizer.advance());
      parameter.addChild(new VariableSyntaxTree(this.tokenizer.advance()));
      
      root.addChild(parameter);
      if(this.tokenizer.getCurrentToken().kind === TokenKind.COMMA){
        parametersLeft = true;
        this.tokenizer.advance();
      }else{
        parametersLeft = false;
      }
    }

    this.eat(TokenKind.R_PARENTHESIS);

    return root;
  }

  private functionDefinition(): AbstractSyntaxTree{
    const retType = this.tokenizer.advance();
    const identifier = new VariableSyntaxTree(this.tokenizer.advance());

    return new FunctionDefinitionSyntaxTree(retType, identifier, this.functionParameters(), this.block());
  }

  private functionCall() : AbstractSyntaxTree {
    const root = new FunctionCallSyntaxTree(this.tokenizer.advance());

    this.eat(TokenKind.L_PARENTHESIS);

    let parametersLeft :boolean = this.tokenizer.getCurrentToken().kind !== TokenKind.R_PARENTHESIS;

    while(parametersLeft){
      root.addChild(this.expression());

      if(this.tokenizer.getCurrentToken().kind === TokenKind.COMMA){
        parametersLeft = true;
        this.tokenizer.advance();
      }else{
        parametersLeft = false;
      }
    }

    this.eat(TokenKind.R_PARENTHESIS);

    return root;
  }

  public program(): AbstractSyntaxTree {
    const root = new ProgramSyntaxTree(this.tokenizer.advance());

    while(this.tokenizer.getCurrentToken().kind !== TokenKind.EOF)
    {
      if(this.tokenizer.getCurrentToken().kind === TokenKind.L_BRACE){
        root.addChild(this.block());
      }
      else if(
        this.tokenizer.peekToken(0).kind === TokenKind.SYMBOL &&
        this.tokenizer.peekToken(1).kind === TokenKind.SYMBOL &&
        this.tokenizer.peekToken(2).kind === TokenKind.L_PARENTHESIS
      ){
        root.addChild(this.functionDefinition());
      }
      else {
        root.addChild(this.sentence());
      }
    }

    return root;
  }
}
