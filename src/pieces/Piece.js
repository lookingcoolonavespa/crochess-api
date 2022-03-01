const Piece = (pieceType) => {
  let current;

  const domNode = document.createElement('div');
  domNode.classList.add(`chess-piece ${pieceType}`);

  function to(square) {
    current = square;
    domNode.style.gridArea = square;
  }

  return {
    domEl,
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
