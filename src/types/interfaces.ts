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
  to: (square: Square) => boolean;
  readonly domEl: HTMLDivElement;
  readonly type: 'king' | 'queen' | 'knight' | 'bishop' | 'rook';
}

export interface Pawn {
  color: Color;
  isValidMove: (target: string, capturesAvailable: Moves) => boolean;
  to: (square: Square, initialPlacement: boolean) => void;
  readonly domEl: HTMLDivElement;
  readonly type: 'pawn';
  getCaptureSquares: () => (string | undefined)[];
}

export interface SquareObj {
  piece: Piece | Pawn | null;
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

interface MovedFrom {
  checkInCheck: () => boolean;
}

interface After {
  movedFrom: (square: Square) => MovedFrom;
}

export interface Gameboard {
  at: (square: Square) => At;
  from: (square: Square) => From;
  after: (square: Square) => After;
  board: Board;
  domBoard: Element;
}
