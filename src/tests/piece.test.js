import Piece from '../pieces/Piece';
import Rook from '../pieces/Rook';

test('toXY works', () => {
  const piece = Piece();
  expect(piece.toXY('a1')).toEqual({ x: 0, y: 1 });
});

test('to works', () => {
  const piece = Piece();
  piece.to('a1');
  expect(piece.current).toBe('a1');
});
