import {
  getAllPossibleMoves,
  removeBlockedMoves,
  removeMovesWithOwnPieces,
} from './logic/moves.js';

const Gameboard = () => {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

  const board = createBoard();
  const allSquares = Object.keys(board);
  const domBoard = createDomBoard();

  function createBoard() {
    return cols.reduce((acc, curr) => {
      rows.forEach((r) => {
        const square = curr.concat(r);
        acc[square] = { piece: null };
      });
      return acc;
    }, {});
  }
  function createDomBoard() {
    const domBoard = document.createElement('div');
    domBoard.setAttribute('class', 'gameboard');
    allSquares.forEach((square, i) => {
      const evenColumn = cols.indexOf(square.charAt(0)) % 2 === 0;
      const domSquare = document.createElement('div');
      domSquare.setAttribute(
        'class',
        `boardSquare ${evenColumn ? 'col-even' : 'col-odd'}`
      );
      domSquare.style.gridArea = square;
      domBoard.append(domSquare);
    });

    return domBoard;
  }

  const at = (square) => ({
    place: (piece) => {
      if (Object.keys(board).indexOf(square) === -1)
        return 'square does not exist';

      piece.to(square, true);
      domBoard.append(piece.domEl);
      board[square].piece = piece;
    },
    remove: () => {
      board[square].piece = null;
    },
    get piece() {
      return board[square].piece;
    },
    getAllValidMoves: () => {
      const piece = at(square).piece;
      if (!piece) return;

      const allPossible = getAllPossibleMoves(piece, board);
      const obstructions = allPossible.filter((s) => board[s].piece);
      if (!obstructions.length) return allPossible;

      const unblockedMoves =
        piece.type === 'knight'
          ? allPossible
          : removeBlockedMoves(square, allPossible, obstructions);

      return removeMovesWithOwnPieces(unblockedMoves, board, piece.color);
    },
  });

  const from = (startSquare) => ({
    to: (endSquare) => {
      const piece = at(startSquare).piece;
      if (!piece) return;

      const allValidMoves = at(startSquare).getAllValidMoves();
      if (allValidMoves.indexOf(endSquare) !== -1) {
        // move piece
        board[startSquare].piece = null;
        board[endSquare].piece = piece;
        piece.to(endSquare);
      }
    },
  });

  return {
    at,
    from,
    get board() {
      return board;
    },
    get domBoard() {
      return domBoard;
    },
  };
};

export default Gameboard;
