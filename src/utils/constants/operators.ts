import { TokenKind } from "./tokenKinds";

type OperatorInfo = {
  tokenID: number;
};

type BinaryArithmeticOperatorInfo = {
  operation: (a: number, b: number) => number;
} & OperatorInfo;

type BinaryLogicalOperatorInfo = {
  operation: (a: boolean, b: boolean) => boolean;
} & OperatorInfo;

type RelationalOperator = {
  operation: (a: number, b: number) => boolean;
} & OperatorInfo;

type EqualityOperator = {
  operation: (a: string, b: string) => boolean;
} & OperatorInfo;

type UnaryArithmeticOperatorInfo = {
  operation: (a: number) => number;
} & OperatorInfo;

type UnaryLogicalOperatorInfo = {
  operation: (a: boolean) => boolean;
} & OperatorInfo;

export const binaryArithmeticOperators: {
  [key: string]: BinaryArithmeticOperatorInfo;
} = {
  "+": {
    operation: (a, b) => a + b,
    tokenID: TokenKind.PLUS,
  },
  "-": {
    operation: (a, b) => a - b,
    tokenID: TokenKind.MINUS,
  },
  "*": {
    operation: (a, b) => a * b,
    tokenID: TokenKind.MUL,
  },
  "/": {
    operation: (a, b) => a / b,
    tokenID: TokenKind.DIV,
  },
  "**": {
    operation: (a, b) => Math.pow(a, b),
    tokenID: TokenKind.POWER,
  },
};

export const relationalOperators: { [key: string]: RelationalOperator } = {
  "<": {
    operation: (a, b) => a < b,
    tokenID: TokenKind.LESS_THAN,
  },
  "<=": {
    operation: (a, b) => a <= b,
    tokenID: TokenKind.LESS_OR_EQUAL_THAN,
  },
  ">": {
    operation: (a, b) => a > b,
    tokenID: TokenKind.GREATER_THAN,
  },
  ">=": {
    operation: (a, b) => a >= b,
    tokenID: TokenKind.GREATER_OR_EQUAL_THAN,
  },
};

export const equalityOperators: { [key: string]: EqualityOperator } = {
  "==": {
    operation: (a, b) => a === b,
    tokenID: TokenKind.EQUAL,
  },
  "!=": {
    operation: (a, b) => a !== b,
    tokenID: TokenKind.DIFFERENT,
  },
};

export const binaryLogicalOperators: {
  [key: string]: BinaryLogicalOperatorInfo;
} = {
  "&&": {
    operation: (a, b) => a && b,
    tokenID: TokenKind.AND,
  },
  "||": {
    operation: (a, b) => a || b,
    tokenID: TokenKind.OR,
  },
};

export const unaryArithmeticOperators: {
  [key: string]: UnaryArithmeticOperatorInfo;
} = {
  "+": {
    operation: (a) => a,
    tokenID: TokenKind.PLUS,
  },
  "-": {
    operation: (a) => a * -1,
    tokenID: TokenKind.MINUS,
  },
};

export const unaryLogicalOperators: {
  [key: string]: UnaryLogicalOperatorInfo;
} = {
  "!": {
    operation: (a) => !a,
    tokenID: TokenKind.NOT,
  },
};

export const langOperators: {
  [key: string]: OperatorInfo;
} = {
  "(": {
    tokenID: TokenKind.L_PARENTHESIS,
  },
  ")": {
    tokenID: TokenKind.R_PARENTHESIS,
  },
  "{": {
    tokenID: TokenKind.L_BRACE,
  },
  "}": {
    tokenID: TokenKind.R_BRACE,
  },
  ";": {
    tokenID: TokenKind.SEMI,
  },
  ",": {
    tokenID: TokenKind.COMMA,
  },
  "&":{
    tokenID: TokenKind.AMPERSAND,
  },
  "|":{
    tokenID: TokenKind.V_LINE,
  },
  "=":{
    tokenID: TokenKind.ASSIGN,
  }
};

export const operators = {
  ...binaryArithmeticOperators,
  ...binaryLogicalOperators,
  ...relationalOperators,
  ...equalityOperators,
  ...unaryArithmeticOperators,
  ...unaryLogicalOperators,
  ...langOperators,
  
}
