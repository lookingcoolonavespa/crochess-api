import {
  getLegalMoves,
  isDiscoveredCheck,
  canBlockOrCaptureCheck,
  shouldToggleEnPassant
} from '../utils/moves';
import { toXY, fromXY } from '../utils/helpers';

import { Color, Square, Board } from '../types/types';
import { PieceInterface, PieceObj } from '../types/interfaces';

const Gameboard = (board: Board) => {
  /* end of state */
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

  function createBoard() {
    return cols.reduce((acc, col) => {
      rows.forEach((row) => {
        const square = col.concat(row.toString());
        acc.set(square, { piece: null });
      });
      return acc;
    }, new Map());
  }

  function getEnPassantSquare(current: Square, color: Color) {
    const { x, y } = toXY(current);
    const newY = color === 'white' ? y - 1 : y + 1;
    return fromXY({ x, y: newY });
  }

  function getKingPosition(color: Color) {
    for (const [square, value] of board.entries()) {
      if (
        value.piece &&
        value.piece.type === 'king' &&
        value.piece.color === color
      )
        return square;
    }
  }

  const at = (square: Square) => ({
    place: (piece: PieceObj) => {
      board.set(square, { piece });
    },
    remove: () => {
      board.set(square, { piece: null });
    },
    get piece() {
      return board.get(square)?.piece;
    },
    getLegalMoves: () => {
      return getLegalMoves(square, board);
    }
  });

  const from = (s1: Square) => ({
    to: (s2: Square) => {
      const piece = at(s1).piece;
      if (!piece) return;

      const legalMoves = at(s1).getLegalMoves();
      if (!legalMoves.includes(s2)) return;

      // capture by en passant
      if (s2 === enPassantDetails.square && enPassantDetails.piece) {
        if (piece.type === 'pawn') {
          at(enPassantDetails.piece.current).remove();
        }
      } else {
        enPassantDetails = { square: '', piece: null };
      }

      // move piece
      board.set(s1, { piece: null });
      if (piece.type === 'pawn') {
        if (shouldToggleEnPassant(s1, s2)) {
          const enPassantSquare = getEnPassantSquare(s2, piece.color);
          enPassantDetails = {
            piece,
            square: enPassantSquare
          };
          board.set(enPassantSquare, { piece: null, enPassant: piece.color });
        }
      }
      board.set(s2, { piece });
    }
  });

  const check = {
    inCheckAfterMove: (from: Square, end: Square): string[] => {
      const squaresGivingCheck: string[] = [];

      const piece = board.get(end)?.piece as PieceObj;
      const oppColor = piece.color === 'white' ? 'black' : 'white';
      const kingPosition = getKingPosition(oppColor) as Square;

      const pieceHitsKing = getLegalMoves(end, board).includes(kingPosition);
      if (pieceHitsKing) squaresGivingCheck.push(end);

      const discoveredCheck = isDiscoveredCheck(
        kingPosition,
        oppColor,
        from,
        board
      );
      if (discoveredCheck) squaresGivingCheck.push(discoveredCheck);

      return squaresGivingCheck;
    },
    checkmate: (color: Color, squaresGivingCheck: string[]): boolean => {
      const kingPos = getKingPosition(color) as Square;
      const legalMoves = at(kingPos).getLegalMoves();
      // check if check can be blocked
      if (squaresGivingCheck.length === 1) {
        if (canBlockOrCaptureCheck(kingPos, squaresGivingCheck[0], board))
          return false;
      }
      if (!legalMoves || !legalMoves.length) return true;
      return false;
    }
  };

  return {
    createBoard,
    at,
    from,
    check
  };
};

export default Gameboard;
