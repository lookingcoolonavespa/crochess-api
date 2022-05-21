# crochess-api

## Using the Gameboard module

Gameboard takes in 3 possible arguments, all of them are optional:
1. board: a map object that holds the state of the board. It records enPassant possibilities, and positions of the pieces. If left undefined, it defaults to an empty board. The map object holds square notation as its keys, and for its values, an object containing piece and/or enPassant values. All mutations and reads will happen on this board map unless another board is given for the method call. 
3. squaresGivingCheck: an array of all the squares of the pieces giving check. If left empty, it will initiliaze to an empty array.
4. castleRights: an object that holds the castle rights state. If left empty, it initializes to a state where all castle rights are avaiable. 

**Gameboard.createBoard** 
```
Gameboard.createBoard()
```

Creates a a map object with the squares of the chessboard as its keys. 

**Gameboard.placePieces**
```
const pieceMap = {
  white: {
    rook: ['a1', 'h1'],
    knight: ['g1', 'b1'],
    bishop: ['f1', 'c1'],
    king: ['e1'],
    queen: ['d1'],
    pawn: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2']
  },
  black: {
    rook: ['a8', 'h8'],
    knight: ['g8', 'b8'],
    bishop: ['f8', 'c8'],
    king: ['e8'],
    queen: ['d8'],
    pawn: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7']
  }
};
  
Gameboard.placePieces(pieceMap, board?)
```

Gameboard.placePieces takes the pieceMap and places pieces accordingly on the board given.
If no board is given, Gameboard.placePieces uses the board Gameboard is initialized with.

**Gameboard.makeMove**
```
const from = 'e2'
const to = 'e4'

Gameboard.makeMove(from, to, promote?)
```

Gameboard.makeMove takes from, to, and promote as arguments. Promote is optional, only to be used when a pawn is to be promoted. It represents the piece type the pawn is to promote into. 

'From' represents the square the piece is currently on. 'To' represents the square is piece is to move to. 

If the move is not a valid move, the function bails out. 

If the move is valid, Gameboard.makeMove makes the appropriate changes to the default board object — moving and removing the approrpriate pieces and toggling enPassant. Gameboard.makeMove does not alter castleRights, only the board map.

**Gameboard.castle**
```
Gameboard.castle('black', 'kingside', board?)
```

Gameboard.castle takes a color, a side, and a board as arguments. Only board is optional.
If no board is given, Gameboard.castle uses the board Gameboard is initialized with. 
No validation is done. Gameboard.side moves the appropriate king and appropriate rook to the castle positions. If no king or rook is found, the function bails out.

### Gameboard.isDraw ###

Gameboard.isDraw is a module holding the methods that check for draw.

**byRepetition**
```
const newBoardState = { pieceMap, castleRights, enPassant}

Gameboard.isDraw.byRepetition(allBoardStates, newBoardState)
```

byRepetition takes allBoardStates and newBoardState as arguments. AllBoardStates can be obtained via Gameboard.get.boardStatesFromHistory and the newBoardState can be created up by bundling the new pieceMap, the new castleRights, and by performing a search for any enPassant values in the new board state. 

byRepetition returns a object containing boolean values for threefold and fivefold repetitions.
```
{ 
  threefold: booelan,
  fivefold: boolean
}
```

**byMoveRule**
```
const history = [['e4','e5'],['Nf3','Nf6']]
Gameboard.isDraw.byMoveRule(history)
```

Takes in a history type as an argument, and returns a an object containing boolean values for fifty and seventyFive move repeitions.
```
{ 
  fifty: boolean,
  seventyFive: boolean,
}
```

**byStalemate**
```
Gameboard.isDraw.byStalemate('black', board?)
```

Takes in a color and a board as arguments. Board is optional. If no board is given, the board Gameboard was initilizaed with is used.

Returns a boolean value of whether or not the opposing color has any moves left. eg. if you input 'black', it'll return if 'white' has any moves left.

**byInsufficientMaterial**
```
Gameboard.isDraw.byInsufficientMaterial(pieceMap?)
```

Takes in a pieceMap as an argument. If no pieceMap is given, it defaults to the pieceMap of the board Gameboard initiliazed with.

Returns a boolean value

### Gameboard.at ###
Takes in a square and board as an argument and returns a module with actions you can perform on that square of that board. Board is optional, defaults to the board Gameboard is initialized with.

**place**
```
const square = 'e4'
const piece = {
                 type: 'pawn'
                 color: 'white'
               }

Gameboard.at(square, board?).place(piece)
```

Takes a piece object as an argument. Places the object on the square provided. If the square does not exist, the function bails out.

**remove**
```
const square = 'e4'
Gameboard.at(square, board?).remove()
```

Removes the piece on the square provided. If the square does not exist, the function bails out.

**promote**
```
const square = 'a8'
const pieceType = 'queen'

Gameboard.at(square, board?).promote(pieceType)
```

Takes in a piece type as an argument. If no piece is on the square provided, the function bails out. Promotes the piece on the square to the piece type provided. No validation occurs.

**setEnPassant** 
```
const from = 'e2'
const to = 'e4'
const color = 'white'

Gameboard.at(from, board?).setEnPassant(color, to)
```

Takes in the color and the current square of the pawn as arguments. Sets the enPassant value on the 'from' square — an object holding the color and current square of the avaialble en Passant move.

**piece**
```
Gameboard.at(square, board?).piece
```

Returns the piece at the square provided. Returns undefined if square does not exist, returns null if square exists but no piece occupies the square.

**getLegalMoves**
```
Gameboard.at(square, board?).getLegalMoves(squaresGivingCheck?)
```

Takes in squaresGivingCheck as an optional argument. Defaults to the squaresGivingCheck Gameboard is initialized with.

Returns all possible legal moves (taking into account checks andd castle rights). Reads the castle rights Gameboard initialized with.

