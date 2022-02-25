const Gameboard = () => {
  let allPieces = [];

  const board = createBoard();
  function createBoard() {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];

    return cols.map((c) => rows.map((r) => c.concat(r))).flat();
  }

  const at = (square) => ({
    place: (piece) => {
      if (board.indexOf(square) === -1) return 'square does not exist';

      piece.to(square);

      allPieces.push({
        piece,
        square,
      });
    },
    remove: () => {
      allPieces.filter((p) => p.square === square);
    },
    get piece() {
      return allPieces.find((p) => p.square === square)?.piece;
    },
    getAllValidMoves: () => {
      const piece = at(square).piece;
      if (!piece) return;

      const allPossible = board.filter(
        (s) => s !== square && piece.isValidMove(s)
      );
      let obstructions = allPossible.filter((s) =>
        allPieces.find((p) => p.square === s)
      );

      if (obstructions.length === 0) return allPossible;

      // split obstructions into x/y axis
      // get all indexes of obstructions
      // get closest indexes

      const [x, y] = square.split('');
      obstructions = obstructions
        .reduce(
          // split all obstructions by y/x axis
          (acc, curr) => {
            const [xaxis] = curr.split('');
            if (xaxis === x) acc[0].push(curr);
            else acc[1].push(curr);

            return acc;
          },
          [[], []]
        )
        .map((axis, i) =>
          // get closest obstructions on each axis
          axis
            .reduce(
              (acc, curr) => {
                const starting = i === 0 ? y : x;
                const [xaxis, yaxis] = curr.split('');
                const compare = i === 0 ? yaxis : xaxis;

                const [behind, front] = acc;

                if (compare < starting && compare > behind) acc[0] = curr;
                if (compare > starting && compare < front) acc[1] = curr;

                return acc;
              },
              [square, 'h8']
            )
            // transform to index of board
            .map((s) => board.indexOf(s))
        );

      return allPossible.filter((s) => {
        console.log(obstructions);
        const indexOfSquare = board.indexOf(s);
        return (
          (indexOfSquare > obstructions[0][0] &&
            indexOfSquare < obstructions[0][1]) ||
          (indexOfSquare > obstructions[1][0] &&
            indexOfSquare < obstructions[1][1])
        );
      });
    },
  });

  const from = (startSquare) => ({
    to: (endSquare) => {
      const piece = at(startSquare).piece;
      if (!piece) return;

      if (piece.isValidMove(endSquare)) {
        // move piece
        allPieces = allPieces.map((p) => {
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
  });

  return {
    at,
    from,
    get board() {
      return board;
    },
  };
};

export default Gameboard;
