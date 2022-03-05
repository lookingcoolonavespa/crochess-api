import { getValidMoves, calcDiscoveredCheck } from '../logic/moves';

import { Color, Square } from '../types/types';
import { Piece, Pawn } from '../types/interfaces';

const Gameboard = () => {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

  const board = createBoard();
  const allSquares = board.keys();
  const domBoard = createDomBoard();

  function createBoard() {
    return cols.reduce((acc, curr) => {
      rows.forEach((r) => {
        const square = curr.concat(r);
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

  function getSquaresOfPieces(color: Color) {
    const squares = [];
    for (const [square, value] of board.entries()) {
      if (value.piece && value.piece.color === color) squares.push(square);
    }
    return squares;
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
      if (!piece) return;

      return getValidMoves(square, board);
    }
  });

  const from = (startSquare: Square) => ({
    to: (endSquare: Square) => {
      const piece = at(startSquare).piece;
      if (!piece) return;

      const validMoves = at(startSquare).getValidMoves();
      if (validMoves.indexOf(endSquare) !== -1) {
        // move piece
        board.set(startSquare, { piece: null });
        board.set(endSquare, { piece });
        piece.to(endSquare);
      }

      return piece;
    }
  });

  const after = (endSquare: Square) => ({
    movedFrom: (startSquare: Square) => ({
      checkInCheck: () => {
        const piece = board.get(endSquare).piece;
        const oppColor = piece.color === 'white' ? 'black' : 'white';
        const kingPosition = getKingPosition(oppColor);

        const pieceHitsKing = getValidMoves(endSquare, board).includes(
          kingPosition
        );
        if (pieceHitsKing) return true;

        const discoveredCheck = calcDiscoveredCheck(
          kingPosition,
          startSquare,
          board
        );
        return discoveredCheck;
      }
    })
  });

  return {
    at,
    from,
    after,
    get board() {
      return board;
    },
    get domBoard() {
      return domBoard;
    }
  };
};

export default Gameboard;
