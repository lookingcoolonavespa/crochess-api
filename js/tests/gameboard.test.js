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

    const allValidMoves = gameboard.at('a1').getAllValidMoves();
    const expected = [
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
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is in front of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    gameboard.at('a1').place(rook);
    gameboard.at('a3').place(secondRook);

    const allValidMoves = gameboard.at('a1').getAllValidMoves();
    const expected = ['a2', 'a3', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is in behind of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    gameboard.at('a3').place(rook);
    gameboard.at('a2').place(secondRook);

    const allValidMoves = gameboard.at('a3').getAllValidMoves();
    const expected = [
      'a2',
      'a4',
      'a5',
      'a6',
      'a7',
      'a8',
      'b3',
      'c3',
      'd3',
      'e3',
      'f3',
      'g3',
      'h3',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is both in front and behind a piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    const thirdRook = Rook();

    gameboard.at('a5').place(rook);
    gameboard.at('a3').place(secondRook);
    gameboard.at('a7').place(thirdRook);

    const allValidMoves = gameboard.at('a5').getAllValidMoves();
    const expected = [
      'a3',
      'a4',
      'a6',
      'a7',
      'b5',
      'c5',
      'd5',
      'e5',
      'f5',
      'g5',
      'h5',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is in front of piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    gameboard.at('a1').place(rook);
    gameboard.at('c1').place(secondRook);
    const allValidMoves = gameboard.at('a1').getAllValidMoves();
    const expected = ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'c1'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is behind piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    gameboard.at('b1').place(rook);
    gameboard.at('d1').place(secondRook);
    const allValidMoves = gameboard.at('d1').getAllValidMoves();

    const expected = [
      'd2',
      'd3',
      'd4',
      'd5',
      'd6',
      'd7',
      'd8',
      'b1',
      'c1',
      'e1',
      'f1',
      'g1',
      'h1',
    ];
    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is both behind and in front of piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    const thirdRook = Rook();

    gameboard.at('b1').place(rook);
    gameboard.at('d1').place(secondRook);
    gameboard.at('g1').place(thirdRook);

    const allValidMoves = gameboard.at('d1').getAllValidMoves();
    const expected = [
      'd2',
      'd3',
      'd4',
      'd5',
      'd6',
      'd7',
      'd8',
      'b1',
      'c1',
      'e1',
      'f1',
      'g1',
    ];
    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('getAllValidMoves works when obstruction is both behind and in front of piece on horizontal and vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    const secondRook = Rook();
    const thirdRook = Rook();
    const fourthRook = Rook();
    const fifthRook = Rook();

    gameboard.at('b5').place(rook);
    gameboard.at('d5').place(secondRook);
    gameboard.at('g5').place(thirdRook);
    gameboard.at('d3').place(fourthRook);
    gameboard.at('d7').place(fifthRook);

    const allValidMoves = gameboard.at('d5').getAllValidMoves();
    const expected = ['d3', 'd4', 'd6', 'd7', 'b5', 'c5', 'e5', 'f5', 'g5'];
    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
});
