/* eslint-disable no-undef */
import Gameboard from '../src/Gameboard';
import Piece from '../src/Piece';
import Castle from '../src/Castle';

test('gameboard is correct', () => {
  const gameboard = Gameboard().board;
  expect(gameboard.size).toBe(64);
});

test('gameboard places pieces correctly', () => {
  const gameboard = Gameboard();
  const rook = { type: 'rook', color: 'white' };
  gameboard.at('a1').place({ type: 'rook', color: 'white' });
  expect(gameboard.at('a1').piece).toEqual(rook);
});

test('gameboard moves pieces correctly', () => {
  const gameboard = Gameboard();
  const rook = { type: 'rook', color: 'white' };
  gameboard.at('a1').place(rook);
  gameboard.from('a1').to('a2');
  expect(gameboard.at('a2').piece).toEqual(rook);
  expect(gameboard.at('a1').piece).toBe(null);
});

describe('hasMove works correctly for each piece', () => {
  test('rook', () => {
    const piece = Piece('white', 'rook');
    expect(piece.hasMove('a1', 'a2')).toBe(true);
    expect(piece.hasMove('a1', 'b2')).toBe(false);
  });
  test('pawn', () => {
    const piece = Piece('white', 'pawn');
    expect(piece.hasMove('e2', 'e3')).toBe(true);
    expect(piece.hasMove('e2', 'e4')).toBe(true);
    expect(piece.hasMove('e2', 'b2')).toBe(false);
  });
});

describe('testing getLegalMoves for Rook', () => {
  test('no obstructions', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'white' };
    gameboard.at('a1').place(rook);

    const legalMoves = gameboard.at('a1').getLegalMoves();
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
      'h1'
    ];

    expect(legalMoves).toEqual(expected);
  });

  test('obstruction is in front of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'white' };
    const secondRook = { type: 'rook', color: 'white' };
    gameboard.at('a1').place(rook);
    gameboard.at('a3').place(secondRook);

    const legalMoves = gameboard.at('a1').getLegalMoves();
    const expected = ['a2', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

    expect(legalMoves).toEqual(expected);
  });

  test('obstruction is in behind of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'white' };
    const secondRook = { type: 'rook', color: 'black' };
    gameboard.at('a3').place(rook);
    gameboard.at('a2').place(secondRook);

    const legalMoves = gameboard.at('a3').getLegalMoves();
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
      'h3'
    ];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is both in front and behind a piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'white' };
    const secondRook = { type: 'rook', color: 'black' };
    const thirdRook = { type: 'rook', color: 'black' };

    gameboard.at('a5').place(rook);
    gameboard.at('a3').place(secondRook);
    gameboard.at('a7').place(thirdRook);

    const legalMoves = gameboard.at('a5').getLegalMoves();
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
      'h5'
    ];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is in front of piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'black' };
    const secondRook = { type: 'rook', color: 'white' };
    gameboard.at('a1').place(rook);
    gameboard.at('c1').place(secondRook);
    const legalMoves = gameboard.at('a1').getLegalMoves();
    const expected = ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'c1'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is behind piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'black' };
    const secondRook = { type: 'rook', color: 'white' };
    gameboard.at('b1').place(rook);
    gameboard.at('d1').place(secondRook);
    const legalMoves = gameboard.at('d1').getLegalMoves();

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
      'h1'
    ];
    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is both behind and in front of piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'white' };
    const secondRook = { type: 'rook', color: 'black' };
    const thirdRook = { type: 'rook', color: 'white' };

    gameboard.at('b1').place(rook);
    gameboard.at('d1').place(secondRook);
    gameboard.at('g1').place(thirdRook);

    const legalMoves = gameboard.at('d1').getLegalMoves();
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
      'g1'
    ];
    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is both behind and in front of piece on horizontal and vertical axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'black' };
    const secondRook = { type: 'rook', color: 'white' };
    const thirdRook = { type: 'rook', color: 'black' };
    const fourthRook = { type: 'rook', color: 'black' };
    const fifthRook = { type: 'rook', color: 'black' };

    gameboard.at('b5').place(rook);
    gameboard.at('d5').place(secondRook);
    gameboard.at('g5').place(thirdRook);
    gameboard.at('d3').place(fourthRook);
    gameboard.at('d7').place(fifthRook);

    const legalMoves = gameboard.at('d5').getLegalMoves();
    const expected = ['d3', 'd4', 'd6', 'd7', 'b5', 'c5', 'e5', 'f5', 'g5'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
});

describe('testing getLegalMoves for Bishop', () => {
  test('no obstructions', () => {
    const gameboard = Gameboard();
    const bishop = { type: 'bishop', color: 'white' };

    gameboard.at('d4').place(bishop);

    const legalMoves = gameboard.at('d4').getLegalMoves();
    const expected = [
      'c3',
      'b2',
      'a1',
      'e5',
      'f6',
      'g7',
      'h8',
      'e3',
      'f2',
      'g1',
      'c5',
      'b6',
      'a7'
    ];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is on right/up diagonal', () => {
    const gameboard = Gameboard();
    const bishop = { type: 'bishop', color: 'white' };
    const secondBishop = { type: 'bishop', color: 'black' };

    gameboard.at('d4').place(bishop);
    gameboard.at('f6').place(secondBishop);

    const legalMoves = gameboard.at('d4').getLegalMoves();
    const expected = [
      'c3',
      'b2',
      'a1',
      'e5',
      'f6',
      'e3',
      'f2',
      'g1',
      'c5',
      'b6',
      'a7'
    ];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is on left/up diagonal', () => {
    const gameboard = Gameboard();
    const bishop = { type: 'bishop', color: 'white' };
    const secondBishop = { type: 'bishop', color: 'white' };

    gameboard.at('d4').place(bishop);
    gameboard.at('b6').place(secondBishop);

    const legalMoves = gameboard.at('d4').getLegalMoves();
    const expected = [
      'c3',
      'b2',
      'a1',
      'e5',
      'f6',
      'g7',
      'h8',
      'e3',
      'f2',
      'g1',
      'c5'
    ];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
});

describe('testing getLegalMoves for Knight', () => {
  test('getLegalMoves works', () => {
    const gameboard = Gameboard();
    const knight = { type: 'knight', color: 'white' };

    gameboard.at('d4').place(knight);

    const legalMoves = gameboard.at('d4').getLegalMoves();
    const expected = ['c6', 'e6', 'c2', 'e2', 'b5', 'b3', 'f5', 'f3'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('removes moves with own pieces', () => {
    const gameboard = Gameboard();
    const knight = { type: 'knight', color: 'white' };
    const rook = { type: 'rook', color: 'white' };
    const rook2 = { type: 'rook', color: 'white' };
    const rook3 = { type: 'rook', color: 'white' };
    const rook4 = { type: 'rook', color: 'white' };
    const rook5 = { type: 'rook', color: 'white' };
    const rook6 = { type: 'rook', color: 'white' };
    const rook7 = { type: 'rook', color: 'white' };
    const rook8 = { type: 'rook', color: 'white' };

    gameboard.at('d4').place(knight);
    gameboard.at('c2').place(rook);
    gameboard.at('c6').place(rook2);
    gameboard.at('e6').place(rook3);
    gameboard.at('e2').place(rook4);
    gameboard.at('b5').place(rook5);
    gameboard.at('b3').place(rook6);
    gameboard.at('f5').place(rook7);
    gameboard.at('f3').place(rook8);

    const legalMoves = gameboard.at('d4').getLegalMoves();
    const expected = [];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
});

describe('testing getLegalMoves for Pawn (white)', () => {
  test('no obstructions', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'white' };

    gameboard.at('e2').place(piece);

    const legalMoves = gameboard.at('e2').getLegalMoves();
    const expected = ['e4', 'e3'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
  test('captures', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'white' };
    const pieceToBeCaptured = { type: 'pawn', color: 'black' };

    gameboard.at('e2').place(piece);
    gameboard.at('d3').place(pieceToBeCaptured);

    const legalMoves = gameboard.at('e2').getLegalMoves();
    const expected = ['e4', 'e3', 'd3'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
  test('cant capture own piece', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'white' };
    const ownPiece = { type: 'pawn', color: 'white' };

    gameboard.at('e2').place(piece);
    gameboard.at('d3').place(ownPiece);

    const legalMoves = gameboard.at('e2').getLegalMoves();
    const expected = ['e4', 'e3'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
  test('cant move when obstruction is same color', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'white' };
    const ownPiece = { type: 'pawn', color: 'white' };

    gameboard.at('e2').place(piece);
    gameboard.at('e3').place(ownPiece);

    const legalMoves = gameboard.at('e2').getLegalMoves();
    const expected = [];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
  test('cant move when obstruction is opposite color', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'white' };
    const oppPiece = { type: 'pawn', color: 'black' };

    gameboard.at('e2').place(piece);
    gameboard.at('e3').place(oppPiece);

    const legalMoves = gameboard.at('e2').getLegalMoves();
    const expected = [];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
  test('en passant', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'black' };
    const pieceToBeCaptured = { type: 'pawn', color: 'white' };

    gameboard.at('e2').place(pieceToBeCaptured);
    gameboard.at('d4').place(piece);
    gameboard.from('e2').to('e4');

    if (gameboard.enPassant.checkToggle('e2', 'e4')) {
      gameboard.enPassant.toggle(pieceToBeCaptured.color, 'e4');
    }

    const legalMoves = gameboard.at('d4').getLegalMoves();
    const expected = ['d3', 'e3'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
  test('en passant doesnt work for own pawns', () => {
    const gameboard = Gameboard();
    const piece = { type: 'pawn', color: 'black' };
    const otherPawn = { type: 'pawn', color: 'black' };

    gameboard.at('e7').place(piece);
    gameboard.at('d7').place(otherPawn);
    gameboard.from('e7').to('e5');

    if (gameboard.enPassant.checkToggle('e7', 'e5')) {
      gameboard.enPassant.toggle('e5', otherPawn.color);
    }

    const legalMoves = gameboard.at('d7').getLegalMoves();
    const expected = ['d6', 'd5'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });
});

describe('legal moves for king', () => {
  test('cant capture piece that is protected by a piece', () => {
    const gameboard = Gameboard();

    gameboard.at('e1').place({ color: 'white', type: 'king' });
    gameboard.at('e2').place({ color: 'black', type: 'knight' });
    gameboard.at('e8').place({ color: 'black', type: 'rook' });

    const legalMoves = gameboard.at('e1').getLegalMoves();

    const expected = ['d1', 'f1', 'd2', 'f2'];
    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves).toEqual(expect.not.arrayContaining(['e2']));
  });

  test('works with multiple kings on the board', () => {
    const gameboard = Gameboard();

    gameboard.at('e1').place({ color: 'white', type: 'king' });
    gameboard.at('e2').place({ color: 'black', type: 'knight' });
    gameboard.at('e8').place({ color: 'black', type: 'rook' });
    gameboard.at('d8').place({ color: 'black', type: 'king' });

    const legalMoves = gameboard.at('e1').getLegalMoves();

    const expected = ['d1', 'f1', 'd2', 'f2'];
    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves).toEqual(expect.not.arrayContaining(['e2']));
  });
});

describe('testing gameboard.get functions', () => {
  describe('inCheck works', () => {
    test('when piece hits king after it moves', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };
      const oppRookStartSquare = 'a8';
      const oppRookEndSquare = 'e8';

      gameboard.at('e1').place(king);
      gameboard.at('a8').place(oppRook);

      gameboard.from(oppRookStartSquare).to(oppRookEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppRookStartSquare,
        oppRookEndSquare
      );

      expect(piecesGivingCheck).toEqual(['e8']);
    });
    test('no false positive', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };
      const oppRookStartSquare = 'a8';
      const oppRookEndSquare = 'a8';

      gameboard.at('e1').place(king);
      gameboard.at('a8').place(oppRook);

      gameboard.from(oppRookStartSquare).to(oppRookEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppRookStartSquare,
        oppRookEndSquare
      );

      expect(piecesGivingCheck).toEqual([]);
    });
    test('discovered check by rook vertically', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };
      const oppBishop = { type: 'bishop', color: 'black' };
      const oppBishopStartSquare = 'e7';
      const oppBishopEndSquare = 'f8';

      gameboard.at('e1').place(king);
      gameboard.at('e8').place(oppRook);
      gameboard.at(oppBishopStartSquare).place(oppBishop);

      gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppBishopStartSquare,
        oppBishopEndSquare
      );

      expect(piecesGivingCheck).toEqual(['e8']);
    });
    test('no false positive on vertical axis', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppPawn = { type: 'pawn', color: 'black' };
      const oppBishop = { type: 'bishop', color: 'black' };
      const oppBishopStartSquare = 'e7';
      const oppBishopEndSquare = 'f8';

      gameboard.at('e1').place(king);
      gameboard.at('e8').place(oppPawn);
      gameboard.at(oppBishopStartSquare).place(oppBishop);

      gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppBishopStartSquare,
        oppBishopEndSquare
      );

      expect(piecesGivingCheck).toEqual([]);
    });
    test('discovered check by rook laterally', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };
      const oppBishop = { type: 'bishop', color: 'black' };
      const oppBishopStartSquare = 'b1';
      const oppBishopEndSquare = 'c2';

      gameboard.at('e1').place(king);
      gameboard.at('a1').place(oppRook);
      gameboard.at(oppBishopStartSquare).place(oppBishop);

      gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppBishopStartSquare,
        oppBishopEndSquare
      );

      expect(piecesGivingCheck).toEqual(['a1']);
    });
    test('no false positive laterally', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppKnight = { type: 'knight', color: 'black' };
      const oppBishop = { type: 'bishop', color: 'black' };
      const oppBishopStartSquare = 'b1';
      const oppBishopEndSquare = 'c2';

      gameboard.at('e1').place(king);
      gameboard.at('a1').place(oppKnight);
      gameboard.at(oppBishopStartSquare).place(oppBishop);

      gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppBishopStartSquare,
        oppBishopEndSquare
      );

      expect(piecesGivingCheck).toEqual([]);
    });
    test('discovered check by bishop', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };
      const oppBishop = { type: 'bishop', color: 'black' };
      const oppRookStartSquare = 'b4';
      const oppRookEndSquare = 'b8';

      gameboard.at('e1').place(king);
      gameboard.at('a5').place(oppBishop);
      gameboard.at(oppRookStartSquare).place(oppRook);

      gameboard.from(oppRookStartSquare).to(oppRookEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppRookStartSquare,
        oppRookEndSquare
      );

      expect(piecesGivingCheck).toEqual(['a5']);
    });
    test('check by knight', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppKnight = { type: 'knight', color: 'black' };
      const oppKnightStartSquare = 'e5';
      const oppKnightEndSquare = 'f3';

      gameboard.at('e1').place(king);
      gameboard.at(oppKnightStartSquare).place(oppKnight);

      gameboard.from(oppKnightStartSquare).to(oppKnightEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppKnightStartSquare,
        oppKnightEndSquare
      );

      expect(piecesGivingCheck).toEqual(['f3']);
    });
    test('check by knight, no false positive', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppKnight = { type: 'knight', color: 'black' };
      const oppKnightStartSquare = 'e5';
      const oppKnightEndSquare = 'g4';

      gameboard.at('e1').place(king);
      gameboard.at(oppKnightStartSquare).place(oppKnight);

      gameboard.from(oppKnightStartSquare).to(oppKnightEndSquare);

      const piecesGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        oppKnightStartSquare,
        oppKnightEndSquare
      );

      expect(piecesGivingCheck).toEqual([]);
    });
  });

  describe('checkmate works', () => {
    test('back rank mate', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };

      gameboard.at('h1').place(king);
      gameboard.at('h2').place({ type: 'pawn', color: 'white' });
      gameboard.at('g2').place({ type: 'pawn', color: 'white' });
      gameboard.at('f1').place(oppRook);

      const squaresGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        'f1',
        'f1'
      );
      const checkmate = gameboard.get.isCheckmate('white', squaresGivingCheck);

      expect(checkmate).toBe(true);
    });
    test('mate with pawn protected by pawn ', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };

      gameboard.at('a1').place(king);
      gameboard.at('b2').place({ type: 'pawn', color: 'black' });
      gameboard.at('a3').place({ type: 'pawn', color: 'black' });
      gameboard.at('c3').place({ type: 'knight', color: 'black' });

      const squaresGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        'b2',
        'b2'
      );
      const checkmate = gameboard.get.isCheckmate('white', squaresGivingCheck);

      expect(checkmate).toBe(true);
    });
    test('calcBlockOrCaptureCheck works', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppRook = { type: 'rook', color: 'black' };
      const blockRook = { type: 'rook', color: 'white' };

      gameboard.at('h1').place(king);
      gameboard.at('h2').place({ type: 'pawn', color: 'white' });
      gameboard.at('g2').place({ type: 'pawn', color: 'white' });
      gameboard.at('a1').place(oppRook);
      gameboard.at('b8').place(blockRook);

      const squaresGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        'a1',
        'a1'
      );
      const checkmate = gameboard.get.isCheckmate('white', squaresGivingCheck);

      expect(checkmate).toBe(false);
    });
    test('cant block knight check', () => {
      const gameboard = Gameboard();
      const king = { type: 'king', color: 'white' };
      const oppKnight = { type: 'knight', color: 'black' };

      gameboard.at('h1').place(king);
      gameboard.at('h2').place({ type: 'bishop', color: 'white' });
      gameboard.at('g2').place({ type: 'bishop', color: 'white' });
      gameboard.at('g1').place({ type: 'rook', color: 'white' });
      gameboard.at('f2').place(oppKnight);

      const squaresGivingCheck = gameboard.get.squaresGivingCheckAfterMove(
        'f2',
        'f2'
      );
      const checkmate = gameboard.get.isCheckmate('white', squaresGivingCheck);

      expect(checkmate).toBe(true);
    });
  });

  test('pieceMap works', () => {
    const gameboard = Gameboard();
    const king = { type: 'king', color: 'white' };
    const oppKnight = { type: 'knight', color: 'black' };

    gameboard.at('h1').place(king);
    gameboard.at('h2').place({ type: 'bishop', color: 'white' });
    gameboard.at('g2').place({ type: 'bishop', color: 'white' });
    gameboard.at('g1').place({ type: 'rook', color: 'white' });
    gameboard.at('f2').place(oppKnight);

    const pieceMap = gameboard.get.pieceMap();
    const expected = {
      white: { rook: ['g1'], bishop: ['g2', 'h2'], king: ['h1'] },
      black: { knight: ['f2'] }
    };

    expect(pieceMap).toEqual(expected);
  });

  describe('getBoardStateFromHistory works', () => {
    test('with one move', () => {
      const gameboard = Gameboard();
      const history = [['e4', 'e5']];
      const boardMap = gameboard.get.boardStateFromHistory(history);

      const wPawn = { color: 'white', type: 'pawn' };
      const bPawn = { color: 'black', type: 'pawn' };

      const pieceMap = gameboard.get.pieceMap(boardMap);

      expect(pieceMap.black.pawn).toEqual(
        expect.arrayContaining(['a7', 'b7', 'c7', 'd7', 'e5', 'f7', 'g7', 'h7'])
      );
      expect(pieceMap.black.pawn.length).toBe(8);

      expect(pieceMap.white.pawn).toEqual(
        expect.arrayContaining(['a2', 'b2', 'c2', 'd2', 'e4', 'f2', 'g2', 'h2'])
      );
      expect(pieceMap.black.pawn.length).toBe(8);
      expect(boardMap.get('e4').piece).toEqual(wPawn);
      expect(boardMap.get('e2').piece).toBe(null);
      expect(boardMap.get('e5').piece).toEqual(bPawn);
      expect(boardMap.get('e7').piece).toBe(null);
    });

    test('with castle', () => {
      const gameboard = Gameboard();
      const history = [
        ['e4', 'e5'],
        ['Nf3', 'Nf6'],
        ['Be2', 'Be7'],
        ['0-0', '0-0']
      ];
      const boardMap = gameboard.get.boardStateFromHistory(history);
      const pieceMap = gameboard.get.pieceMap(boardMap);

      expect(pieceMap.black.rook).toEqual(expect.arrayContaining(['a8', 'f8']));
      expect(pieceMap.black.rook.length).toBe(2);
      expect(pieceMap.black.knight).toEqual(
        expect.arrayContaining(['b8', 'f6'])
      );
      expect(pieceMap.black.knight.length).toBe(2);
      expect(pieceMap.black.king).toEqual(expect.arrayContaining(['g8']));
      expect(pieceMap.black.king.length).toBe(1);
      expect(pieceMap.black.bishop).toEqual(
        expect.arrayContaining(['e7', 'c8'])
      );
      expect(pieceMap.black.bishop.length).toBe(2);
      expect(pieceMap.black.pawn).toEqual(
        expect.arrayContaining(['a7', 'b7', 'c7', 'd7', 'e5', 'f7', 'g7', 'h7'])
      );
      expect(pieceMap.black.pawn.length).toBe(8);

      expect(pieceMap.white.rook).toEqual(expect.arrayContaining(['a1', 'f1']));
      expect(pieceMap.white.rook.length).toBe(2);
      expect(pieceMap.white.knight).toEqual(
        expect.arrayContaining(['b1', 'f3'])
      );
      expect(pieceMap.white.knight.length).toBe(2);
      expect(pieceMap.white.king).toEqual(expect.arrayContaining(['g1']));
      expect(pieceMap.white.king.length).toBe(1);
      expect(pieceMap.white.bishop).toEqual(
        expect.arrayContaining(['e2', 'c1'])
      );
      expect(pieceMap.white.bishop.length).toBe(2);
      expect(pieceMap.white.pawn).toEqual(
        expect.arrayContaining(['a2', 'b2', 'c2', 'd2', 'e4', 'f2', 'g2', 'h2'])
      );
      expect(pieceMap.white.pawn.length).toBe(8);
    });
  });
});

describe('castle stuff', () => {
  describe('canCastle works', () => {
    test('reads castle object correctly', () => {
      const wKing = { type: 'king', color: 'white' };
      const wRook = { type: 'rook', color: 'white' };
      const bKing = { type: 'king', color: 'black' };
      const bRook = { type: 'rook', color: 'black' };

      const gameboards = [
        Gameboard(undefined, [], Castle(true, true, true, true)),
        Gameboard(undefined, [], Castle(false, false, false, false))
      ];
      gameboards.forEach((board) => {
        board.at('e1').place(wKing);
        board.at('a1').place(wRook);
        board.at('h1').place(wRook);
        board.at('e8').place(bKing);
        board.at('a8').place(bRook);
        board.at('h8').place(bRook);
      });

      expect(gameboards[0].get.canCastle('white', 'kingside')).toBe(true);
      expect(gameboards[0].get.canCastle('white', 'queenside')).toBe(true);
      expect(gameboards[0].get.canCastle('black', 'kingside')).toBe(true);
      expect(gameboards[0].get.canCastle('black', 'queenside')).toBe(true);

      expect(gameboards[1].get.canCastle('white', 'kingside')).toBe(false);
      expect(gameboards[1].get.canCastle('white', 'queenside')).toBe(false);
      expect(gameboards[1].get.canCastle('black', 'kingside')).toBe(false);
      expect(gameboards[1].get.canCastle('black', 'queenside')).toBe(false);
    });

    test('returns false when rook is missing', () => {
      const gameboard = Gameboard();

      expect(gameboard.get.canCastle('white', 'kingside')).toBe(false);
      expect(gameboard.get.canCastle('white', 'queenside')).toBe(false);
      expect(gameboard.get.canCastle('black', 'kingside')).toBe(false);
      expect(gameboard.get.canCastle('black', 'queenside')).toBe(false);
    });

    test('canCastle is false when theres a piece on the castle squares', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'knight', color: 'white' };

      gameboard.at('h1').place(rook);
      gameboard.at('g1').place(piece);

      const castle = gameboard.get.canCastle('white', 'kingside');

      expect(castle).toBe(false);
    });

    test('canCastle is false when theres a piece attacking one of the castle squares', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'knight', color: 'black' };

      gameboard.at('h1').place(rook);
      gameboard.at('f3').place(piece);

      const castle = gameboard.get.canCastle('white', 'kingside');

      expect(castle).toBe(false);
    });

    test('canCastle is false when theres a pawn attacking one of the castle squares', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'pawn', color: 'black' };

      gameboard.at('h1').place(rook);
      gameboard.at('f2').place(piece);

      const castle = gameboard.get.canCastle('white', 'kingside');

      expect(castle).toBe(false);
    });

    test('pawn attack is not false positive', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'pawn', color: 'black' };

      gameboard.at('h1').place(rook);
      gameboard.at('d2').place(piece);

      const castle = gameboard.get.canCastle('white', 'kingside');

      expect(castle).toBe(true);
    });
  });

  describe('castle works', () => {
    test('castle sets king and rook on right squares (kingside, black)', () => {
      const gameboard = Gameboard();

      const king = { type: 'king', color: 'black' };
      const rook = { type: 'rook', color: 'black' };

      gameboard.at('e8').place(king);
      gameboard.at('h8').place(rook);

      gameboard.castle('black', 'kingside');

      expect(gameboard.get.pieceMap()).toEqual({
        white: {},
        black: { rook: ['f8'], king: ['g8'] }
      });
    });

    test('castle sets king and rook on right squares (queenside, black)', () => {
      const gameboard = Gameboard();

      const king = { type: 'king', color: 'black' };
      const rook = { type: 'rook', color: 'black' };

      gameboard.at('e8').place(king);
      gameboard.at('a8').place(rook);

      gameboard.castle('black', 'queenside');

      expect(gameboard.get.pieceMap()).toEqual({
        white: {},
        black: { rook: ['d8'], king: ['c8'] }
      });
    });

    test('castle sets king and rook on right squares (kingside, white)', () => {
      const gameboard = Gameboard();

      const king = { type: 'king', color: 'white' };
      const rook = { type: 'rook', color: 'white' };

      gameboard.at('e1').place(king);
      gameboard.at('h1').place(rook);

      gameboard.castle('white', 'kingside');

      expect(gameboard.get.pieceMap()).toEqual({
        black: {},
        white: { rook: ['f1'], king: ['g1'] }
      });
    });

    test('castle sets king and rook on right squares (queenside, white)', () => {
      const gameboard = Gameboard();

      const king = { type: 'king', color: 'white' };
      const rook = { type: 'rook', color: 'white' };

      gameboard.at('e1').place(king);
      gameboard.at('a1').place(rook);

      gameboard.castle('white', 'queenside');

      expect(gameboard.get.pieceMap()).toEqual({
        black: {},
        white: { rook: ['d1'], king: ['c1'] }
      });
    });
  });
});

describe('validate works', () => {
  describe('validate.move works', () => {
    test('returns false when piece doesnt exist', () => {
      const gameboard = Gameboard();
      const valid = gameboard.validate.move('e2', 'e4');

      expect(valid).toBe(false);
    });

    test('returns true when move is in legal moves', () => {
      const gameboard = Gameboard();
      gameboard.at('e2').place({ color: 'white', type: 'pawn' });
      const valid = gameboard.validate.move('e2', 'e4');

      expect(valid).toBe(true);
    });

    test('returns false when move isnt in legal moves', () => {
      const gameboard = Gameboard();
      gameboard.at('e2').place({ color: 'white', type: 'pawn' });
      const valid = gameboard.validate.move('e2', 'e5');

      expect(valid).toBe(false);
    });
  });

  describe('validate.promotion works', () => {
    test('returns false when piece type isnt pawn', () => {
      const gameboard = Gameboard();
      gameboard.at('d7').place({ color: 'white', type: 'king' });

      const noPieceValidation = gameboard.validate.promotion('e7', 'e8');
      const notPawnValidation = gameboard.validate.promotion('d7', 'd8');

      expect(noPieceValidation).toBe(false);
      expect(notPawnValidation).toBe(false);
    });
  });
  test('returns false when rank isnt end of board', () => {
    const gameboard = Gameboard();
    gameboard.at('e6').place({ color: 'white', type: 'pawn' });

    expect(gameboard.validate.promotion('e6', 'e7')).toBe(false);
  });
  test('returns true when rank is end of board', () => {
    const gameboard = Gameboard();
    gameboard.at('e7').place({ color: 'white', type: 'pawn' });

    expect(gameboard.validate.promotion('e7', 'e8')).toBe(true);
  });
});

describe('makeMove works', () => {
  test('returns undefined when piece doesnt exist', () => {
    const gameboard = Gameboard();

    const newBoardState = gameboard.makeMove('e2', 'e4');

    expect(newBoardState).toBe(undefined);
  });
  test('toggles enPassant', () => {
    const gameboard = Gameboard();

    gameboard.at('e6').setEnPassant('black', 'e5');
    gameboard.at('e2').place({ color: 'white', type: 'pawn' });
    gameboard.makeMove('e2', 'e4');
    const removedEnPassant = gameboard.board.get('e6').enPassant;
    const enPassant = gameboard.board.get('e3').enPassant;
    const pawnOnE4 = gameboard.board.get('e4').piece;

    expect(removedEnPassant).toBe(undefined);
    expect(enPassant).toEqual({ current: 'e4', color: 'white' });
    expect(pawnOnE4).toEqual({ color: 'white', type: 'pawn' });
  });
  test('promotes correctly', () => {
    const gameboard = Gameboard();

    gameboard.at('e7').place({ color: 'white', type: 'pawn' });
    gameboard.makeMove('e7', 'e8', 'queen');

    expect(gameboard.at('e7').piece).toBe(null);
    expect(gameboard.at('e8').piece).toEqual({ color: 'white', type: 'queen' });
  });
  test('handles castling correctly', () => {
    const gameboard = Gameboard();
    const wKing = { color: 'white', type: 'king' };
    const bKing = { color: 'black', type: 'king' };
    const wRook = { color: 'white', type: 'rook' };
    const bRook = { color: 'black', type: 'rook' };

    gameboard.at('e1').place(wKing);
    gameboard.at('h1').place(wRook);

    gameboard.at('e8').place(bKing);
    gameboard.at('a8').place(bRook);

    gameboard.makeMove('e1', 'g1');
    gameboard.makeMove('e8', 'c8');

    expect(gameboard.at('e8').piece).toBe(null);
    expect(gameboard.at('a8').piece).toBe(null);
    expect(gameboard.at('c8').piece).toEqual(bKing);
    expect(gameboard.at('d8').piece).toEqual(bRook);
    expect(gameboard.at('e1').piece).toBe(null);
    expect(gameboard.at('h1').piece).toBe(null);
    expect(gameboard.at('g1').piece).toEqual(wKing);
    expect(gameboard.at('f1').piece).toEqual(wRook);
  });
});
