/* eslint-disable no-undef */
import History from '../src/History';
import Gameboard from '../src/Gameboard';

describe('affixPiece works', () => {
  test('doesnt affix anything for pawn moves', () => {
    const gameboard = Gameboard();
    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );
    const piece = { type: 'pawn', color: 'white' };

    const from = 'e2';
    const to = 'e4';

    gameboard.at(from).place(piece);
    gameboard.from(from).to(to);

    const notation = history.affixPiece(from, to);

    expect(notation).toBe(to);
  });

  test('attaches correct prefix when there are no complications', () => {
    const gameboard = Gameboard();
    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );
    const piece = { type: 'bishop', color: 'white' };

    const from = 'f1';
    const to = 'e2';

    gameboard.at(from).place(piece);
    gameboard.from(from).to(to);

    const notation = history.affixPiece(from, to);

    expect(notation).toBe('Be2');
  });

  test('attaches file when theres another rook on same rank', () => {
    const gameboard = Gameboard();
    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );
    const piece = { type: 'rook', color: 'white' };
    const otherPiece = { type: 'rook', color: 'white' };

    const from = 'f1';
    const to = 'e2';
  });
});
