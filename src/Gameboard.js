import {
  getAllPossibleMoves,
  removeBlockedMoves,
  removeMovesWithOwnPieces,
} from './logic/moves.js';

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
    for (const square in allSquares) {
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

  const at = (square) => ({
    place: (piece) => {
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
    getAllValidMoves: () => {
      const piece = at(square).piece;
      if (!piece) return;

      const allPossible = getAllPossibleMoves(piece, board);
      const obstructions = allPossible.filter((s) => board.get(s).piece);
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
        board.set(startSquare, { piece: null });
        board.set(endSquare, { piece });
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
