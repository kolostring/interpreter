import { TOKEN } from "./tokenTypes";

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
    tokenID: TOKEN.PLUS,
  },
  "-": {
    operation: (a, b) => a - b,
    tokenID: TOKEN.MINUS,
  },
  "*": {
    operation: (a, b) => a * b,
    tokenID: TOKEN.MUL,
  },
  "/": {
    operation: (a, b) => a / b,
    tokenID: TOKEN.DIV,
  },
  "^": {
    operation: (a, b) => Math.pow(a, b),
    tokenID: TOKEN.POWER,
  },
};

export const relationalOperators: { [key: string]: RelationalOperator } = {
  "<": {
    operation: (a, b) => a < b,
    tokenID: TOKEN.LESS_THAN,
  },
  "<=": {
    operation: (a, b) => a <= b,
    tokenID: TOKEN.LESS_OR_EQUAL_THAN,
  },
  ">": {
    operation: (a, b) => a > b,
    tokenID: TOKEN.GREATER_THAN,
  },
  ">=": {
    operation: (a, b) => a >= b,
    tokenID: TOKEN.GREATER_OR_EQUAL_THAN,
  },
};

export const equalityOperators: { [key: string]: EqualityOperator } = {
  "==": {
    operation: (a, b) => a === b,
    tokenID: TOKEN.EQUAL,
  },
  "!=": {
    operation: (a, b) => a !== b,
    tokenID: TOKEN.DIFFERENT,
  },
};

export const binaryLogicalOperators: {
  [key: string]: BinaryLogicalOperatorInfo;
} = {
  "&&": {
    operation: (a, b) => a && b,
    tokenID: TOKEN.AND,
  },
  "||": {
    operation: (a, b) => a || b,
    tokenID: TOKEN.OR,
  },
};

export const unaryArithmeticOperators: {
  [key: string]: UnaryArithmeticOperatorInfo;
} = {
  "+": {
    operation: (a) => a,
    tokenID: TOKEN.PLUS,
  },
  "-": {
    operation: (a) => a * -1,
    tokenID: TOKEN.MINUS,
  },
};

export const unaryLogicalOperators: {
  [key: string]: UnaryLogicalOperatorInfo;
} = {
  "!": {
    operation: (a) => !a,
    tokenID: TOKEN.NOT,
  },
};

export const langOperators: {
  [key: string]: OperatorInfo;
} = {
  "(": {
    tokenID: TOKEN.L_PARENTHESIS,
  },
  ")": {
    tokenID: TOKEN.R_PARENTHESIS,
  },
  "{": {
    tokenID: TOKEN.L_BRACE,
  },
  "}": {
    tokenID: TOKEN.R_BRACE,
  },
  ";": {
    tokenID: TOKEN.SEMI,
  },
  ",": {
    tokenID: TOKEN.COMMA,
  },
  "&":{
    tokenID: TOKEN.AMPERSAND,
  },
  "|":{
    tokenID: TOKEN.V_LINE,
  },
  "=":{
    tokenID: TOKEN.ASSIGN,
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
