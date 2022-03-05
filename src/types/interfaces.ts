import { Color } from './types';

export interface Coord {
  x: number;
  y: number;
}

export interface HalfCoord {
  x?: number;
  y?: number;
}

export interface Piece {
  color: Color;
  isValidMove: (target: string) => boolean;
  to: (square: string) => boolean;
  domEl: HTMLElement;
  type: 'king' | 'queen' | 'knight' | 'bishop' | 'rook';
}

export interface Pawn {
  color: Color;
  isValidMove: (target: string, capturesAvailable: string[]) => boolean;
  to: (square: string, initialPlacement: boolean) => void;
  domEl: HTMLElement;
  type: 'pawn';
  getCaptureSquares: () => string[];
}

export interface SquareObj {
  piece: Piece | Pawn | null;
}
