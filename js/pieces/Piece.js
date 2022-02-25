const Piece = () => {
  let current;

  const domNode = document.createElement('div');
  domNode.classList.add('chess-piece');

  let domEl = () => domNode;

  function to(square) {
    current = square;
  }

  function toXY(square) {
    const [x, y] = square.split('');
    return {
      x: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(x.toLowerCase()),
      y: Number(y),
    };
  }

  return {
    domEl,
    to,
    get current() {
      return current;
    },
    toXY,
  };
};

export default Piece;
