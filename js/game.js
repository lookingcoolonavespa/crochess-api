import Gameboard from './Gameboard';
import Rook from './pieces/Rook';
import Pawn from './pieces/Pawn';
import Knight from './pieces/Knight';
import Bishop from './pieces/Bishop';
import Queen from './pieces/Queen';
import King from './pieces/King';
/*
pieces need to:
- have moveset
- need to keep track of whether pawn can advance two squares


gameboard module needs to: 
- keep track of where pieces are
- calculate possible moves
- need to keep track of en passant
- castling

game module needs to:
- control turn
- timer
- announce checks 

*/

const game = (() => {
  let gameboard;
  let turn;

  function init() {
    gameboard = Gameboard();
    placePawns('white');
    placePawns('black');
    placePieces('white');
    placePieces('black');

    function placePawns(color) {
      const row = color === 'white' ? 2 : 7;
      const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      cols.forEach((c) => {
        gameboard.at(c.concat(row)).place(Pawn(color));
      });
    }

    function placePieces(color) {
      const row = color === 'white' ? 1 : 8;
      const piecePosition = {
        a: Rook,
        b: Bishop,
        c: Knight,
        d: Queen,
        e: King,
        f: Knight,
        g: Bishop,
        h: Rook,
      };

      const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      cols.forEach((col) => {
        gameboard.at(col.concat(row)).place(piecePosition[col](color));
      });
    }
  }
  return {
    get gameboard() {
      return gameboard;
    },
    init,
  };
})();

export default game;
