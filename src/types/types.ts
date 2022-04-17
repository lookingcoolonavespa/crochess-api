import { SquareObj } from './interfaces';

export type Moves = string[];

export type Board = Map<string, SquareObj>;

export type Square = string;

export type Color = 'black' | 'white';

export type PieceType =
  | 'king'
  | 'queen'
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'pawn';

export interface CastleSquaresType {
  kingside: Moves;
  queenside: Moves;
}
