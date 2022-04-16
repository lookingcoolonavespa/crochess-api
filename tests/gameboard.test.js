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

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
  });

  test('obstruction is in front of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = { type: 'rook', color: 'white' };
    const secondRook = { type: 'rook', color: 'white' };
    gameboard.at('a1').place(rook);
    gameboard.at('a3').place(secondRook);

    const legalMoves = gameboard.at('a1').getLegalMoves();
    const expected = ['a2', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

    expect(legalMoves).toEqual(expect.arrayContaining(expected));
    expect(legalMoves.length).toBe(expected.length);
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
      gameboard.enPassant.toggle('e4', pieceToBeCaptured.color);
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
    test('mate with protected pawn ', () => {
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

      expect(gameboards[0].canCastle('white', 'kingside')).toBe(true);
      expect(gameboards[0].canCastle('white', 'queenside')).toBe(true);
      expect(gameboards[0].canCastle('black', 'kingside')).toBe(true);
      expect(gameboards[0].canCastle('black', 'queenside')).toBe(true);

      expect(gameboards[1].canCastle('white', 'kingside')).toBe(false);
      expect(gameboards[1].canCastle('white', 'queenside')).toBe(false);
      expect(gameboards[1].canCastle('black', 'kingside')).toBe(false);
      expect(gameboards[1].canCastle('black', 'queenside')).toBe(false);
    });

    test('returns false when rook is missing', () => {
      const gameboard = Gameboard();

      expect(gameboard.canCastle('white', 'kingside')).toBe(false);
      expect(gameboard.canCastle('white', 'queenside')).toBe(false);
      expect(gameboard.canCastle('black', 'kingside')).toBe(false);
      expect(gameboard.canCastle('black', 'queenside')).toBe(false);
    });

    test('canCastle is false when theres a piece on the castle squares', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'knight', color: 'white' };

      gameboard.at('h1').place(rook);
      gameboard.at('g1').place(piece);

      const castle = gameboard.canCastle('white', 'kingside');

      expect(castle).toBe(false);
    });

    test('canCastle is false when theres a piece attacking one of the castle squares', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'knight', color: 'black' };

      gameboard.at('h1').place(rook);
      gameboard.at('f3').place(piece);

      const castle = gameboard.canCastle('white', 'kingside');

      expect(castle).toBe(false);
    });

    test('canCastle is false when theres a pawn attacking one of the castle squares', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'pawn', color: 'black' };

      gameboard.at('h1').place(rook);
      gameboard.at('f2').place(piece);

      const castle = gameboard.canCastle('white', 'kingside');

      expect(castle).toBe(false);
    });

    test('pawn attack is not false positive', () => {
      const gameboard = Gameboard();

      const rook = { type: 'rook', color: 'white' };
      const piece = { type: 'pawn', color: 'black' };

      gameboard.at('h1').place(rook);
      gameboard.at('d2').place(piece);

      const castle = gameboard.canCastle('white', 'kingside');

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
