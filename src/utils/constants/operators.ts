type BinaryArithmeticOperatorInfo = {
  operation: (a: number, b: number) => number;
};

type BinaryLogicalOperatorInfo = {
  operation: (a: boolean, b: boolean) => boolean;
};

type RelationalOperator = {
  operation: (a: number, b: number) => boolean;
}

type EqualityOperator = {
  operation: (a: string, b: string) => boolean;
}

type UnaryArithmeticOperatorInfo = {
  operation: (a: number) => number;
};

type UnaryLogicalOperatorInfo = {
  operation: (a: boolean) => boolean;
};

export const binaryArithmeticOperators: {
  [key: string]: BinaryArithmeticOperatorInfo;
} = {
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

export const relationalOperators : {[key: string]: RelationalOperator} = {
  "<": {
    operation: (a, b) => a < b,
  },
  "<=": {
    operation: (a, b) => a <= b,
  },
  ">": {
    operation: (a, b) => a > b,
  },
  ">=": {
    operation: (a, b) => a >= b,
  },
}

export const equalityOperators : {[key :string]: EqualityOperator} = {
  "==": {
    operation: (a, b) => a === b,
  },
  "!=": {
    operation: (a, b) => a !== b,
  },
}

export const binaryLogicalOperators: {
  [key: string]: BinaryLogicalOperatorInfo;
} = {
  "&&": {
    operation: (a, b) => a && b,
  },
  "||": {
    operation: (a, b) => a || b,
  }
};

export const unaryArithmeticOperators: {
  [key: string]: UnaryArithmeticOperatorInfo;
} = {
  "+": {
    operation: (a) => a,
  },
  "-": {
    operation: (a) => a * -1,
  },
};

export const unaryLogicalOperators: {
  [key: string]: UnaryLogicalOperatorInfo;
} = {
  "!": {
    operation: (a) => !a,
  },
};
