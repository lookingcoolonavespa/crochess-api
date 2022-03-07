import { Coord } from '../types/interfaces';
import { Square } from '../types/types';

function toXY(square: Square) {
  const [x, y] = square.split('');
  return {
    x: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(x.toLowerCase()),
    y: Number(y)
  };
}

function fromXY(coord: Coord) {
  const { x, y } = coord;
  const col = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];

  return col.concat(y.toString());
}

const calcDistance = (squareOne: string) => (squareTwo: string) => {
  const { x: x1, y: y1 } = toXY(squareOne);
  const { x: x2, y: y2 } = toXY(squareTwo);

  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return {
    xDiff,
    yDiff
  };
};

export { toXY, fromXY, calcDistance };
