import { Color, Square, Board, Moves } from './types';

export interface Coord {
  x: number;
  y: number;
}

export interface xCoord {
  x: number;
}

export interface yCoord {
  y: number;
}

export interface Piece {
  color: Color;
  isValidMove: (target: Square) => boolean;
  to: (square: Square) => void;
  readonly domEl: HTMLDivElement;
  readonly type: 'king' | 'queen' | 'knight' | 'bishop' | 'rook';
}

export interface Pawn {
  color: Color;
  isValidMove: (target: string) => boolean;
  to: (square: Square, initialPlacement: boolean) => void;
  readonly domEl: HTMLDivElement;
  readonly type: 'pawn';
  getCaptureSquares: () => string[];
}

export interface SquareObj {
  piece: Piece | Pawn | null;
  enPassant?: boolean;
}

interface At {
  place: (piece: Piece | Pawn) => void;
  remove: () => void;
  piece: () => Piece | Pawn | null;
  getValidMoves: () => undefined | string[];
}

interface From {
  to: (endSquare: Square) => Piece | Pawn | undefined;
}

interface Check {
  inCheckAfterMove: (startSquare: Square, endSquare: Square) => Moves;
  checkmate: (color: Color, squaresGivingCheck: string[]) => boolean;
}

export interface Gameboard {
  at: (square: Square) => At;
  from: (square: Square) => From;
  check: Check;
  board: Board;
  domBoard: Element;
}
