import {
  getLegalMoves,
  isDiscoveredCheck,
  canBlockOrCaptureCheck
} from './utils/moves';
import { toXY, fromXY } from './utils/helpers';

import { Color, Square, Board } from './types/types';
import { PieceObj } from './types/interfaces';

const Gameboard = (board: Board) => {
  board = board || createBoard();

  function createBoard() {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];

    return cols.reduce((acc, col) => {
      rows.forEach((row) => {
        const square = col.concat(row.toString());
        acc.set(square, { piece: null });
      });
      return acc;
    }, new Map());
  }

  const enPassant = (() => {
    function getSquare(current: Square, color: Color): Square {
      const { x, y } = toXY(current);
      const newY = color === 'white' ? y - 1 : y + 1;
      return fromXY({ x, y: newY });
    }

    return {
      checkToggle: (from: Square, to: Square): boolean => {
        const { y: y1 } = toXY(from);
        const { y: y2 } = toXY(to);

        return Math.abs(y1 - y2) === 2;
      },
      toggle: (current: Square, color: Color): void => {
        const enPassantSquare = getSquare(current, color);
        at(enPassantSquare).setEnPassant(color, current);
      },
      remove: (): void => {
        for (const squareObj of board.values()) {
          if (squareObj.enPassant) return (squareObj.enPassant = undefined);
        }
      }
    };
  })();

  const at = (square: Square) => ({
    place: (piece: PieceObj) => {
      if (!board.get(square)) return 'square does not exist';

      board.set(square, { piece });
    },
    remove: () => {
      if (!board.get(square)) return 'square does not exist';

      board.set(square, { piece: null });
    },
    setEnPassant: (color: Color, current: Square) => {
      if (!board.get(square)) return 'square does not exist';

      board.set(square, {
        piece: null,
        enPassant: {
          current,
          color: color
        }
      });
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

      // move piece
      at(s1).remove();
      at(s2).place(piece);
    }
  });

  const get = {
    kingPosition: (color: Color): Square | undefined => {
      for (const [square, value] of board.entries()) {
        if (
          value.piece &&
          value.piece.type === 'king' &&
          value.piece.color === color
        )
          return square;
      }
    },
    piecePositions: (color: Color): Square[] => {
      const piecePositions = [];
      for (const [square, value] of board.entries()) {
        if (value.piece && value.piece.color === color)
          piecePositions.push(square);
      }
      return piecePositions;
    },
    squaresGivingCheckAfterMove: (from: Square, end: Square): string[] => {
      const squaresGivingCheck: string[] = [];

      const piece = board.get(end)?.piece as PieceObj;
      const oppColor = piece.color === 'white' ? 'black' : 'white';
      const kingPosition = get.kingPosition(oppColor) as Square;

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
    isCheckmate: (color: Color, squaresGivingCheck: string[]): boolean => {
      const kingPos = get.kingPosition(color) as Square;
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
    enPassant,
    at,
    from,
    get,
    get board() {
      return board;
    }
  };
};

export default Gameboard;
