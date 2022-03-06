import Piece from '../pieces/Piece';
import { toXY } from '../logic/helpers';

import { test, expect } from 'jest';

test('toXY works', () => {
  expect(toXY('a1')).toEqual({ x: 0, y: 1 });
});

test('to works', () => {
  const piece = Piece();
  piece.to('a1');
  expect(piece.current).toBe('a1');
});
