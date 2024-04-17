import { TokenKind } from "./tokenKinds";

export type Keyword = {[key: string]: TokenKind}

export const keywords: Keyword = {
  "true": TokenKind.TRUE,
  "false": TokenKind.FALSE,
  "return": TokenKind.RETURN,
  "if": TokenKind.IF,
  "else": TokenKind.ELSE,
  "elif": TokenKind.ELIF,
}