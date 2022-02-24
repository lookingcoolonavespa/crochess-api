const moves = {
  vertAndLateral:
    ({ x: x1, y: y1 }) =>
    ({ x: x2, y: y2 }) =>
      x1 === x2 || y1 === y2,
  diagonal:
    ({ x: x1, y: y1 }) =>
    ({ x: x2, y: y2 }) =>
      Math.abs(x2 - x1) === Math.abs(y2 - y1),
  xByN:
    (num) =>
    ({ x: x1 }) =>
    ({ x: x2 }) =>
      Math.abs(x1 - x2) === num,
  yByN:
    (num) =>
    ({ y: y1 }) =>
    ({ y: y2 }) =>
      Math.abs(y1 - y2) === num,
};

export default moves;
