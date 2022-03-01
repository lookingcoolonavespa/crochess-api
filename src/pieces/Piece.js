const Piece = (pieceType, color) => {
  let current;

  const domNode = document.createElement('div');
  domNode.classList.add('chess-piece', pieceType, color);

  function to(square) {
    current = square;
    domNode.style.gridArea = square;
  }

  return {
    to,
    get current() {
      return current;
    },
    get domEl() {
      return domNode;
    },
  };
};

export default Piece;
