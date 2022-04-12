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

  test('attaches file when theres another knight on same rank', () => {
    const gameboard = Gameboard();
    const piece = { type: 'knight', color: 'white' };
    const otherPiece = { type: 'knight', color: 'white' };

    const from = 'g1';
    const to = 'e2';
    const sameRank = 'c1';

    gameboard.at(from).place(piece);
    gameboard.at(sameRank).place(otherPiece);
    gameboard.from(from).to(to);

    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );

    const notation = history.affixPiece(from, to);

    expect(notation).toBe('Nge2');
  });

  test('attaches rank when theres another knight on same file', () => {
    const gameboard = Gameboard();
    const piece = { type: 'knight', color: 'white' };
    const otherPiece = { type: 'knight', color: 'white' };

    const from = 'g1';
    const to = 'e2';
    const sameFile = 'g3';

    gameboard.at(from).place(piece);
    gameboard.at(sameFile).place(otherPiece);
    gameboard.from(from).to(to);

    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );

    const notation = history.affixPiece(from, to);

    expect(notation).toBe('N1e2');
  });

  test('attaches file when theres another rook on same rank', () => {
    const gameboard = Gameboard();
    const piece = { type: 'rook', color: 'white' };
    const otherPiece = { type: 'rook', color: 'white' };

    const from = 'a1';
    const to = 'e1';
    const sameRank = 'h1';

    gameboard.at(from).place(piece);
    gameboard.at(sameRank).place(otherPiece);
    gameboard.from(from).to(to);

    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );

    const notation = history.affixPiece(from, to);

    expect(notation).toBe('Rae1');
  });

  test('attaches rank when theres another rook on same file', () => {
    const gameboard = Gameboard();
    const piece = { type: 'rook', color: 'white' };
    const otherPiece = { type: 'rook', color: 'white' };

    const from = 'a1';
    const to = 'a5';
    const sameFile = 'a8';

    gameboard.at(from).place(piece);
    gameboard.at(sameFile).place(otherPiece);
    gameboard.from(from).to(to);

    const history = History(
      undefined,
      gameboard.board,
      gameboard.get.pieceMap()
    );

    const notation = history.affixPiece(from, to);

    expect(notation).toBe('R1a5');
  });
});
