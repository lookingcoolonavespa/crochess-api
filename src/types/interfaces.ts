import { Color, Square, Board, Moves, PieceType } from './types';

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

export interface PieceInterface {
  hasMove: (from: Square, to: Square) => boolean;
  getPawnCaptures: (origin: Square) => Square[] | undefined;
  readonly color: Color;
  readonly type: 'king' | 'queen' | 'knight' | 'bishop' | 'rook' | 'pawn';
}

export interface PieceObj {
  type: PieceType;
  color: Color;
}

export interface EnPassantObj {
  color: Color;
  current: Square;
}

export interface SquareObj {
  piece: PieceObj | null;
  enPassant?: EnPassantObj;
}

interface At {
  place: (piece: PieceInterface) => void;
  remove: () => void;
  piece: () => PieceInterface | null;
  getValidMoves: () => undefined | string[];
}

interface From {
  to: (endSquare: Square) => void;
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
