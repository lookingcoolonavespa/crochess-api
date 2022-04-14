import { AllPieceMap } from './types/interfaces';

const standard: AllPieceMap = {
  white: {
    rook: ['a1', 'h1'],
    knight: ['g1', 'b1'],
    bishop: ['f1', 'c1'],
    king: ['e1'],
    queen: ['d1'],
    pawn: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2']
  },
  black: {
    rook: ['a8', 'h8'],
    knight: ['g8', 'b8'],
    bishop: ['f8', 'c8'],
    king: ['e8'],
    queen: ['d8'],
    pawn: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7']
  }
};

export { standard };
