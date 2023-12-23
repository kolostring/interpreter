type BinaryOperatorInfo = {
  operation: ((a: number, b: number) => number);
};

type UnaryOperatorInfo = {
  operation: ((a: number) => number);
};

export const binaryOperators: { [key: string]: BinaryOperatorInfo } = {
  "+": {
    operation: (a, b) => a + b,
  },
  "-": {
    operation: (a, b) => a - b,
  },
  "*": {
    operation: (a, b) => a * b,
  },
  "/": {
    operation: (a, b) => a / b,
  },
  "^": {
    operation: (a, b) => Math.pow(a, b),
  },
};

export const unaryOperators: { [key: string]: UnaryOperatorInfo } = {
  "+": {
    operation: (a) => a,
  },
  "-": {
    operation: (a) => a * -1,
  },
};