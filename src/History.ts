// should output history object that holds move history in 2d array
// for each move needs to attach piece Type to beginning of move if not pawn
// should further specify square of piece if, say both rooks, can move to same square

import { AllPieceMap, HistoryObj, PieceObj } from './types/interfaces';
import { Board, PieceType, Square, HistoryType } from './types/types';
import { getLegalMoves } from './utils/moves';

export default function History(
  prevHistory: HistoryType,
  board: Board,
  pieceMap: AllPieceMap
): HistoryObj {
  const history: HistoryType = prevHistory || [];

  const get = {
    piecePrefix: (from: Square, to: Square) => {
      const { type, color } = board.get(to)?.piece as PieceObj;

      switch (type) {
        case 'pawn':
          return '';
        case 'knight':
        case 'rook': {
          let prefix = type === 'rook' ? 'R' : 'N';
          if (pieceMap[color][type].length !== 1) {
            // look for piece of same type that couldve also went to the square
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

          return prefix;
        }
        default: {
          const prefix = type.charAt(0).toUpperCase();
          return prefix;
        }
      }
    },
    castleNotation: (side: 'kingside' | 'queenside') => {
      return side === 'kingside' ? 'O-O' : 'O-O-O';
    }
  };

  const affix = {
    capture: (notation: string, prefix: string) => {
      return `${prefix}x${notation}`;
    },
    promote: (move: Square, pieceType: PieceType) => {
      const suffix =
        pieceType === 'knight' ? 'N' : pieceType.charAt(0).toUpperCase();

      return `${move}=${suffix}`;
    },
    check: (notation: string) => {
      return `${notation}+`;
    },
    checkmate: (notation: string) => {
      return `${notation}#`;
    }
  };

  return {
    get,
    affix,
    insertMove: (notation: string) => {
      const lastMovePair = history[history.length - 1];
      if (lastMovePair.length === 1) {
        lastMovePair.push(notation);
      } else {
        const newMovePair = [notation];
        history.push(newMovePair);
      }
    }
  };
}
