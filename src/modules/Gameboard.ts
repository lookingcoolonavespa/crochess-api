import {
  getValidMoves,
  isDiscoveredCheck,
  canBlockOrCaptureCheck,
  shouldToggleEnPassant
} from '../logic/moves';
import { toXY, fromXY } from '../logic/helpers';

import { Color, Square } from '../types/types';
import { Piece, Pawn } from '../types/interfaces';

const Gameboard = () => {
  /* state */
  interface enPassantDetails {
    square: Square;
    piece: Pawn | null;
  }
  let enPassantDetails: enPassantDetails = {
    square: '',
    piece: null
  };
  /* end of state */
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

  const board = createBoard();
  const allSquares = board.keys();
  const domBoard = createDomBoard();

  function createBoard() {
    return cols.reduce((acc, curr) => {
      rows.forEach((r) => {
        const square = curr.concat(r.toString());
        acc.set(square, { piece: null });
      });
      return acc;
    }, new Map());
  }
  function createDomBoard() {
    const domBoard = document.createElement('div');
    domBoard.setAttribute('class', 'gameboard');
    for (const square of allSquares) {
      const evenColumn = cols.indexOf(square.charAt(0)) % 2 === 0;
      const domSquare = document.createElement('div');
      domSquare.setAttribute(
        'class',
        `boardSquare ${evenColumn ? 'col-even' : 'col-odd'}`
      );
      domSquare.style.gridArea = square;
      domBoard.append(domSquare);
    }

    return domBoard;
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
    place: (piece: Piece | Pawn) => {
      if (!board.has(square)) return 'square does not exist';

      piece.to(square, true);
      domBoard.append(piece.domEl);
      board.set(square, { piece });
    },
    remove: () => {
      board.set(square, { piece: null });
    },
    get piece() {
      return board.get(square).piece;
    },
    getValidMoves: () => {
      const piece = at(square).piece;

      return getValidMoves(piece, square, board);
    }
  });

  const from = (startSquare: Square) => ({
    to: (endSquare: Square) => {
      const piece: Piece | Pawn = at(startSquare).piece;
      if (!piece) return;

      const validMoves = at(startSquare).getValidMoves();
      if (!validMoves.includes(endSquare)) return;

      // capture by en passant
      if (endSquare === enPassantDetails.square && enPassantDetails.piece) {
        if (piece.type === 'pawn') {
          at(enPassantDetails.piece.current).remove();
        }
      } else {
        enPassantDetails = { square: '', piece: null };
      }

      // move piece
      board.set(startSquare, { piece: null });
      if (piece.type === 'pawn') {
        if (shouldToggleEnPassant(startSquare, endSquare)) {
          const enPassantSquare = getEnPassantSquare(endSquare, piece.color);
          enPassantDetails = {
            piece,
            square: enPassantSquare
          };
          board.set(enPassantSquare, { piece: null, enPassant: piece.color });
        }
      }
      board.set(endSquare, { piece });
      piece.to(endSquare);
    }
  });

  const check = {
    inCheckAfterMove: (movedFrom: Square, endSquare: Square): string[] => {
      const squaresOfPiecesGivingCheck: string[] = [];

      const piece = board.get(endSquare).piece;
      const oppColor = piece.color === 'white' ? 'black' : 'white';
      const kingPosition = getKingPosition(oppColor);

      const pieceHitsKing = getValidMoves(piece, endSquare, board).includes(
        kingPosition
      );
      if (pieceHitsKing) squaresOfPiecesGivingCheck.push(endSquare);

      const discoveredCheck = isDiscoveredCheck(
        kingPosition,
        oppColor,
        movedFrom,
        board
      );
      if (discoveredCheck) squaresOfPiecesGivingCheck.push(discoveredCheck);

      return squaresOfPiecesGivingCheck;
    },
    checkmate: (color: Color, squaresGivingCheck: string[]): boolean => {
      const kingPosition = getKingPosition(color);
      const validMoves = at(kingPosition).getValidMoves();
      // check if check can be blocked
      if (squaresGivingCheck.length === 1) {
        if (canBlockOrCaptureCheck(kingPosition, squaresGivingCheck[0], board))
          return false;
      }
      if (!validMoves || !validMoves.length) return true;
      return false;
    }
  };

  return {
    at,
    from,
    check,
    get board() {
      return board;
    },
    get domBoard() {
      return domBoard;
    }
  };
};

export default Gameboard;
