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
    allSquares.forEach((square) => {
      const domSquare = document.createElement('div');
      domSquare.setAttribute('class', 'boardSquare');
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

      const allPossible = allSquares.filter((s) => {
        if (piece.type === 'pawn') {
          const captureSquares = piece.getCaptureSquares();
          const capturesAvailable = captureSquares.filter(
            (s) => board[s].piece && board[s].piece.color !== piece.color
          );
          return s !== square && piece.isValidMove(s, capturesAvailable);
        }
        return s !== square && piece.isValidMove(s);
      });
      return allPossible;

      // // filter possible moves based on where obstructions are
      // obstructions = obstructions
      //   .reduce(
      //     // split all obstructions by y/x axis
      //     (acc, curr) => {
      //       const [xaxis] = curr.split('');
      //       if (xaxis === x) acc[0].push(curr);
      //       else acc[1].push(curr);

      //       return acc;
      //     },
      //     [[], []]
      //   )
      //   .map((axis, i) =>
      //     // get closest obstructions on each axis
      //     axis
      //       .reduce(
      //         (acc, curr) => {
      //           const starting = i === 0 ? y : x;
      //           const [xaxis, yaxis] = curr.split('');
      //           const compare = i === 0 ? yaxis : xaxis;

      //           const [behind, front] = acc;

      //           if (compare < starting && curr > behind) acc[0] = curr;
      //           if (compare > starting && curr < front) acc[1] = curr;

      //           return acc;
      //         },
      //         ['a1', 'h8']
      //       )
      //       // transform to index of board
      //       .map((s) => board.indexOf(s))
      //   );

      // return allPossible.filter((s) => {
      //   const [xObstructions, yObstructions] = obstructions;

      //   const [xaxis] = s.split('');
      //   const indexOfSquare = board.indexOf(s);
      //   return xaxis === x
      //     ? indexOfSquare >= xObstructions[0] &&
      //         indexOfSquare <= xObstructions[1]
      //     : indexOfSquare >= yObstructions[0] &&
      //         indexOfSquare <= yObstructions[1];
      // });
    },
  });

  const from = (startSquare) => ({
    to: (endSquare) => {
      const piece = at(startSquare).piece;
      if (!piece) return;

      if (piece.isValidMove(endSquare)) {
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
