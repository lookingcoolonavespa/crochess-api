import Gameboard from '../Gameboard';
import Rook from '../pieces/Rook';

test('gameboard is correct', () => {
  const gameboard = Gameboard();
  expect(gameboard.board.length).toBe(64);
});

test('gameboard places pieces correctly', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  gameboard.at('a1').place(rook);
  expect(gameboard.at('a1').piece).toEqual(rook);
});

test('gameboard.at.place doesnt accept invalid squares', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  expect(gameboard.at('a0').place(rook)).toBe('square does not exist');
});

test('gameboard moves pieces correctly', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  gameboard.at('a1').place(rook);
  gameboard.from('a1').to('a2');
  expect(gameboard.at('a2').piece).toEqual(rook);
  expect(gameboard.at('a1').piece).toBe(undefined);
});

test('rook isValidMove works correctly', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  gameboard.at('a1').place(rook);
  expect(rook.isValidMove('a2')).toBe(true);
  expect(rook.isValidMove('b2')).toBe(false);
});

describe('testing getAllValidMoves', () => {
  test('getAllValidMoves works when there are no obstructions', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    gameboard.at('a1').place(rook);
    expect(gameboard.at('a1').getAllValidMoves()).toEqual([
      'a2',
      'a3',
      'a4',
      'a5',
      'a6',
      'a7',
      'a8',
      'b1',
      'c1',
      'd1',
      'e1',
      'f1',
      'g1',
      'h1',
    ]);
  });

  test('getAllValidMoves works when obstruction is in front of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    gameboard.at('a1').place(rook);
    gameboard.at('a3').place(rook);
    expect(gameboard.at('a1').getAllValidMoves()).toEqual([
      'a2',
      'b1',
      'c1',
      'd1',
      'e1',
      'f1',
      'g1',
      'h1',
    ]);
  });
});
