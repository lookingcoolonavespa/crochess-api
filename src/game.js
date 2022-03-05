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

  function init(wrapper) {
    gameboard = Gameboard();
    placePawns('white');
    placePawns('black');
    placePieces('white');
    placePieces('black');
    wrapper.textContent = '';
    wrapper.append(gameboard.domBoard);

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
        b: Knight,
        c: Bishop,
        d: Queen,
        e: King,
        f: Bishop,
        g: Knight,
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