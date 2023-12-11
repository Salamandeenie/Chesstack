    // The selected Game Piece
    let selectedGamePiece = null;

    // Quite possibly the most important piece to this mess. This keeps track of the filled slots.
    var BoardData = [];

    // This is the holder for the next BoardData update. This allows for that stacking, and ownership to work.
    var BoardUpdateData = [];

    // The possible moves that can be made by the selected piece.
    var possibleMoves = [];

    // This two keep track whose turn it is
    var turnTracker = 0;
    var turnToColor = ["Blue", "Orange"];

    const gameBoard = document.getElementById('game-board');

    // Inputs
    var playerCount;
    var boardSize;
    var boardType;
