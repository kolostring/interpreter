export enum TokenKind {
  BOF,
  EOF,
  SYMBOL,
  L_PARENTHESIS,
  R_PARENTHESIS,
  L_BRACE,
  R_BRACE,
  COMMA,
  SEMI,
  AMPERSAND,
  V_LINE,
  ASSIGN,
  PLUS,
  MINUS,
  MUL,
  DIV,
  POWER,
  LESS_THAN,
  GREATER_THAN,
  LESS_OR_EQUAL_THAN,
  GREATER_OR_EQUAL_THAN,
  EQUAL,
  DIFFERENT,
  AND,
  OR,
  NOT,
  TRUE,
  FALSE,
  NUMBER,
  RETURN,
  IF,
  ELSE,
  ELIF
}

export function isTokenLiteral(tokenKind: TokenKind){
  return tokenKind === TokenKind.NUMBER || tokenKind === TokenKind.FALSE || tokenKind === TokenKind.TRUE;
}

export function isTokenUnaryOperator(tokenKind: TokenKind){
  return tokenKind === TokenKind.PLUS || tokenKind === TokenKind.MINUS || tokenKind === TokenKind.NOT;
}

export function isTokenArithmeticOperator(tokenKind: TokenKind){
  return tokenKind === TokenKind.PLUS || tokenKind === TokenKind.MINUS || tokenKind === TokenKind.DIV || tokenKind === TokenKind.MUL || tokenKind === TokenKind.POWER;
}

export function isTokenRelationalOperator(tokenKind: TokenKind){
  return tokenKind === TokenKind.GREATER_THAN || tokenKind === TokenKind.GREATER_OR_EQUAL_THAN || tokenKind === TokenKind.LESS_THAN || tokenKind === TokenKind.LESS_OR_EQUAL_THAN;
}

export function isTokenEqualityOperator(tokenKind: TokenKind){
  return tokenKind === TokenKind.EQUAL || tokenKind === TokenKind.DIFFERENT;
}

export function isTokenLogicalOperator(tokenKind: TokenKind){
  return tokenKind === TokenKind.NOT || tokenKind === TokenKind.AND || tokenKind === TokenKind.OR
}