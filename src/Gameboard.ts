import {
  getLegalMoves,
  getDiscoveredCheck,
  canBlockOrCaptureCheck,
  getAttackingMovesForColor,
  getLegalMovesInCheck
} from './utils/moves';
import { toXY, fromXY } from './utils/helpers';

import { Color, Square, Board, PieceType, Moves } from './types/types';
import { PieceMap, PieceObj } from './types/interfaces';

const Gameboard = (board: Board, squaresGivingCheck: Moves) => {
  board = board || createBoard();

  function createBoard() {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

    return files.reduce((acc, file) => {
      ranks.forEach((rank) => {
        const square = file.concat(rank.toString());
        acc.set(square, { piece: null });
      });
      return acc;
    }, new Map());
  }

  function canCastle(color: Color, side: 'kingside' | 'queenside') {
    const rank = color === 'white' ? 1 : 8;
    const castleSquares =
      side === 'kingside' ? [`f${rank}`, `g${rank}`] : [`c${rank}`, `d${rank}`];

    const oppColor = color === 'white' ? 'black' : 'white';
    const oppMoves = getAttackingMovesForColor(oppColor, board);

    let canCastle = true;

    castleSquares.forEach((s) => {
      // check if castle square is cleared
      if (at(s).piece) canCastle = false;

      // make sure castle square isnt attacked
      if (oppMoves.includes(s)) {
        canCastle = false;
      }
    });

    return canCastle;
  }

  function castle(color: Color, side: 'kingside' | 'queenside') {
    const rank = color === 'white' ? 1 : 8;
    const castleSquares =
      side === 'kingside' ? [`f${rank}`, `g${rank}`] : [`d${rank}`, `c${rank}`];

    const kingPos = get.kingPosition(color) as Square;
    const rookPos = getRookPos() as Square;

    from(rookPos).to(castleSquares[0]);
    from(kingPos).to(castleSquares[1]);

    function getRookPos() {
      const pieceMap = get.pieceMap();
      const rookPos = pieceMap[color].rook.find((square) => {
        const file = square.split('')[0];
        return side === 'kingside'
          ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(file) > 3
          : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(file) < 3;
      });

      return rookPos;
    }
    // need to get king position
    // need to get castle squares
    // need to find rook
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
    promote: (pieceType: PieceType) => {
      const squareVal = board.get(square);
      const piece = squareVal?.piece;
      if (!piece) return;

      board.set(square, { ...squareVal, piece: { ...piece, type: pieceType } });
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
    getLegalMoves: (): Moves => {
      squaresGivingCheck = squaresGivingCheck || [];
      const { type, color } = at(square).piece as PieceObj;

      switch (squaresGivingCheck.length) {
        case 2: {
          if (type !== 'king') return [];
          return getLegalMoves(square, board);
        }
        case 1: {
          return getLegalMovesInCheck(
            origin,
            board,
            get.kingPosition(color) as Square,
            squaresGivingCheck[0]
          );
        }
        default: {
          return getLegalMoves(square, board);
        }
      }
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
    pieceMap: (): {
      white: PieceMap;
      black: PieceMap;
    } => {
      const pieceMap = { white: {} as PieceMap, black: {} as PieceMap };
      for (const [square, value] of board.entries()) {
        const { piece } = value;
        if (!piece) continue;

        const { type, color } = piece;
        pieceMap[color][type] = pieceMap[color][type]
          ? [...pieceMap[color][type], square]
          : [square];
      }
      return pieceMap;
    },
    squaresGivingCheckAfterMove: (from: Square, end: Square): Square[] => {
      const squaresGivingCheck: string[] = [];

      const piece = board.get(end)?.piece as PieceObj;
      const oppColor = piece.color === 'white' ? 'black' : 'white';
      const kingPosition = get.kingPosition(oppColor) as Square;

      const pieceHitsKing = getLegalMoves(end, board).includes(kingPosition);
      if (pieceHitsKing) squaresGivingCheck.push(end);

      const discoveredCheck = getDiscoveredCheck(
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
    castle,
    canCastle,
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
