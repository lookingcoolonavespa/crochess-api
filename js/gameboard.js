const Gameboard = () => {
  let allPieces = [];

  const board = createBoard();
  function createBoard() {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];

    return cols.map((c) => rows.map((r) => c.concat(r))).flat();
  }

  // need to place pieces onto squares
  // need to remove pieces from board
  // need to keep track of pieces
  //
  return {
    at: (square) => ({
      place: (piece) => {
        piece.to(square);

        allPieces.push({
          piece,
          square: target,
        });
      },
      remove: () => {
        allPieces.filter((p) => p.square === square);
      },
      get piece() {
        return allPieces.find((p) => p.square === square).piece;
      },
    }),
    from: (startSquare) => ({
      to: (endSquare) => {
        const piece = Gameboard.at(startSquare).piece;
        if (!piece) return;

        if (piece.isValidMove(endSquare)) {
          const capture = !!Gameboard.at(endSquare).piece;
          if (capture) Gameboard.at(endSquare).remove();

          // move piece
          allPieces.map((p) => {
            if (p.square === startSquare) {
              p.piece.to(endSquare);
              return {
                piece: p.piece,
                square: endSquare,
              };
            }
            return p;
          });
        }
      },
    }),
    get board() {
      return board;
    },
  };
};

export default Gameboard;
