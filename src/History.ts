// should output history object that holds move history in 2d array
// for each move needs to attach piece Type to beginning of move if not pawn
// should further specify square of piece if, say both rooks, can move to same square

import { AllPieceMap, PieceObj } from './types/interfaces';
import { Board, Square } from './types/types';
import { getLegalMoves } from './utils/moves';

type HistoryType = Square[][];

export default function History(
  prevHistory: HistoryType,
  board: Board,
  pieceMap: AllPieceMap
) {
  const history: HistoryType = prevHistory || [];

  return {
    affixPiece: (from: Square, to: Square) => {
      const { type, color } = board.get(to)?.piece as PieceObj;

      switch (type) {
        case 'pawn':
          return to;
        case 'knight':
        case 'rook': {
          let prefix = type === 'rook' ? 'R' : 'N';
          if (pieceMap[color][type].length !== 1) {
            pieceMap[color][type].forEach((s) => {
              if (s === to) return;

              const boardCopy = new Map(board);
              boardCopy.set(to, { piece: null });

              if (getLegalMoves(s, boardCopy).includes(to)) {
                const [x1, y1] = from.split('');
                const [x2] = s.split('');
                const sameFile = x1 === x2;

                prefix = sameFile ? prefix + y1 : prefix + x1;
              }
            });
          }

          return `${prefix}${to}`;
        }
        default: {
          const prefix = type.charAt(0).toUpperCase();
          return `${prefix}${to}`;
        }
      }
    },
    insertMove: (move: Square) => {
      const lastMovePair = history[history.length - 1];
      if (lastMovePair.length === 1) {
        lastMovePair.push(move);
      } else {
        const newMovePair = [move];
        history.push(newMovePair);
      }
    }
  };
}
