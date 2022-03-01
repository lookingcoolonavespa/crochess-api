function toXY(square) {
  const [x, y] = square.split('');
  return {
    x: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(x.toLowerCase()),
    y: Number(y),
  };
}

function fromXY(coord) {
  const { x, y } = coord;
  const col = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];

  return col.concat(y);
}

function findVectors(square, compare) {
  const { x: x1, y: y1 } = toXY(square);
}

export { toXY, fromXY };
