// gameFunctions


// Constructor Functions
{
    // Constructor for GamePiece
    function GamePiece(position, level, owner) {
        this.position = position; // Array [x, y]
        this.level = level;
        this.owner = owner;
    }
}

// Board functions
{
    //Starts the game based on the inputs given
    function startGame() {
        // Set your variables (boardType, boardSize, playerCount, etc.)

    if (boardType == "chess")
    {
        if(playerCount == 2)
        {
            boardSize = 8;
            createAscendingGPRow(2,5,[0, 0],"Orange",false);
            createAscendingGPRow(5,2,[8 / 2, 0],"Orange",false);
            createGamePieceRow(8, [1, 0 + 1], 1, "Orange");
    
            createAscendingGPRow(2,5,[0, 8 - 1],"Blue",false);
            createAscendingGPRow(5,2,[8 / 2, 8 - 1],"Blue",false);
            createGamePieceRow(8, [1, 8 - 2], 1, "Blue");
        }

        if (playerCount == 4)
        {
            boardSize = 12;
            createAscendingGPRow(2,5,[2, 0],"Orange",false);
            createAscendingGPRow(5,2,[12 / 2, 0],"Orange",false);
            createGamePieceRow(8, [2, 0 + 1], 1, "Orange");

            createAscendingGPRow(2,5,[0, 2],"Green", true);
            createAscendingGPRow(5,2,[0, 6],"Green", true);
            createGamePieceRow(8, [1, 2], 1, "Green", true);
    
            createAscendingGPRow(2,5,[2, 12 - 1],"Blue",false);
            createAscendingGPRow(5,2,[12 / 2, 12 - 1],"Blue",false);
            createGamePieceRow(8, [2, 12 - 2], 1, "Blue");

            createAscendingGPRow(2,5,[12 - 1, 2],"Violet", true);
            createAscendingGPRow(5,2,[12 - 1, 6],"Violet", true);
            createGamePieceRow(8, [12 - 2, 2], 1, "Violet", true);
        }
 
    }

    else if (boardType == "custom") {
            if (playerCount == 2)
            {
            createGamePieceRow(boardSize, [1, 0], 1, "Orange");
            createGamePieceRow(boardSize, [1, boardSize - 1], 1, "Blue");
            }

            if (playerCount == 4) {
                createGamePieceRow(boardSize -2, [1, 0], 1, "Orange");
                createGamePieceRow(boardSize -2, [1, boardSize - 1], 1, "Blue");
                createGamePieceRow(boardSize -2, [0, 1], 1, "Green", true);
                createGamePieceRow(boardSize -2, [boardSize - 1, 1], 1, "Violet", true);

                BoardUpdateData.push(new GamePiece([0,0], 1, "White"));
                BoardUpdateData.push(new GamePiece([boardSize -1,0], 1, "White"));
                BoardUpdateData.push(new GamePiece([0, boardSize -1], 1, "White"));
                BoardUpdateData.push(new GamePiece([boardSize -1, boardSize -1], 1, "White"));
                
                turnToColor.push("Green");
                turnToColor.push("Violet");
            }
        }

        // Resolve conflicts after drawing the initial board
        resolveBoardConflicts();
    }


    // Function to draw the game board
    function drawGameBoard() {
        const gameBoard = document.getElementById('game-board');

        // Clear the existing content
        gameBoard.innerHTML = '';
        gameBoard.style.width = (boardSize * 3 + "vw");
        gameBoard.style.height = (boardSize * 3 + "vw");

        // Loop through all possible positions on the board
        for (let row = 0; row < boardSize; row++) {
            for(let col = 0; col < boardSize; col++)
            {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'empty-space square';

                cellDiv.style.gridColumn = col + 1; // Add 1 because grid starts at 1
                cellDiv.style.gridRow = row + 1; // Add 1 because grid starts at 1

                gameBoard.appendChild(cellDiv);
            }

            for (let col = 0; col < boardSize; col++) {
                const position = [col, row];

                // Check if there's a game piece at this position
                const hasGamePiece = BoardData.some(piece => isEqual(piece.position, position));

                // Create a div element for the cell
                const cellDiv = document.createElement('div');

                // If there's a game piece, render it; otherwise, render an empty space
                if (hasGamePiece) {
                    cellDiv.className = 'game-piece';
                    const gamePiece = BoardData.find(piece => isEqual(piece.position, position));
                    cellDiv.style.backgroundColor = gamePiece.owner.toLowerCase();
                    cellDiv.innerText = gamePiece.level;

                    // Add data-gpID attribute
                    cellDiv.setAttribute('data-gpID', BoardData.indexOf(gamePiece));
                }

                // Set the position using grid column and row
                cellDiv.style.gridColumn = col + 1; // Add 1 because grid starts at 1
                cellDiv.style.gridRow = row + 1; // Add 1 because grid starts at 1

                // Append the div to the game board
                gameBoard.appendChild(cellDiv);
            }
        }
    }

    

    // This creates a row of GamePieces and appends it to BoardData
    function createGamePieceRow(Length = boardSize, startPos = [0, 0], stackHeight = 1, owner, isVertical = false) {
        for (let i = 0; i < Length; i++) {
            let position;
            
            if (isVertical) {
                position = [startPos[0], startPos[1] + i];
            } else {
                position = [startPos[0] + i, startPos[1]];
            }

            const gamePiece = new GamePiece(position, stackHeight, owner);
            BoardUpdateData.push(gamePiece); // Push each game piece individually
        }

        resolveBoardConflicts();
    }

    // This is essentially a variant of the previous function. This creates a row of pieces that increases / descends cup stack height as it loops.
    function createAscendingGPRow(startHeight = 0, endHeight = 1, startPos = [0, 0], owner, isVertical = false) {
        const loopCount = Math.abs(startHeight - endHeight) +1;
        const step = (startHeight < endHeight) ? 1 : -1; // Determine if stack height should increase or decrease
        var curHei = startHeight;

        for (let i = 0; i < loopCount; i++) {
            let position;
            let height;

            if (isVertical) {
                position = [startPos[0], startPos[1] + i];
            } else {
                position = [startPos[0] + i, startPos[1]];
            }

            height = curHei;
            curHei += step;

            const gamePiece = new GamePiece(position, height, owner);
            BoardUpdateData.push(gamePiece); // Push each game piece individually
        }

        resolveBoardConflicts();
    }

    // Keeps track of whose turn it is currently
    function returnColorTurn()
    {
        return turnToColor[(turnTracker % turnToColor.length)];
    }

    // Function to resolve conflicts and update positions
    function resolveBoardConflicts() {
        for (let i = 0; i < BoardUpdateData.length; i++) {
            const gamePiece = BoardUpdateData[i];

        // Wrap around if x is greater than or equal to board limit
        if (gamePiece.position[0] >= boardSize) {
            gamePiece.position[0] = gamePiece.position[0] % boardSize;
        }

        // Wrap around if x is less than 0
        else if (gamePiece.position[0] < 0) {
            gamePiece.position[0] = (boardSize - Math.abs(gamePiece.position[0])) % boardSize;
        }

        // Wrap around if y is greater than or equal to board limit
        if (gamePiece.position[1] >= boardSize) {
            gamePiece.position[1] = gamePiece.position[1] % boardSize;
        }

        // Wrap around if y is less than 0
        else if (gamePiece.position[1] < 0) {
            gamePiece.position[1] = (boardSize - Math.abs(gamePiece.position[1])) % boardSize;
        }

        // Check for conflicts with existing pieces in BoardData
        const existingPiece = BoardData.find(piece => isEqual(piece.position, gamePiece.position));

        if (existingPiece) {
            // Resolve conflict - modify gamePiece's information as needed
            gamePiece.level += existingPiece.level; // Adjust levels
            // Optionally, you can do more adjustments based on your requirements

            // Remove the existing piece from BoardData
            destroyGamePiece(existingPiece);
        }

        // Add the resolved gamePiece to BoardData
        BoardData.push(gamePiece);
    }
    // Clear the update array after resolving conflicts
    BoardUpdateData = [];
    drawGameBoard();
    }

    function checkForWinner() {
        const uniqueOwners = [...new Set(BoardData.map(piece => piece.owner))];
    
        turnToColor = turnToColor.filter(color => uniqueOwners.includes(color));
    
        if (turnToColor.length === 1) {
            const winner = turnToColor[0];
            alert(`${winner} wins the game!`);
            location.reload();
        }
    
        return false; // No winner yet
    }


    // Destroys a given gamePiece
    function destroyGamePiece(gamePiece) {
        // Find the index of the gamePiece in BoardData
        const index = BoardData.findIndex(piece => isEqual(piece.position, gamePiece.position));

        // If found, remove it from the array
        if (index !== -1) {
            BoardData.splice(index, 1);
        }
        else return console.log("Error - Game Object does not exist!");
    }

    // Highlights the selected piece, and what positions it can move to
    function highlightPosition()
    {
        // Remove all elements with a ppID
        const ppElements = document.querySelectorAll('[data-ppid]');
        ppElements.forEach(element => element.remove());

        possibleMoves = calcPossibleMoves();
        

        for (let i = 0; i < possibleMoves.length; i++)
        {
            document.getElementById('game-board').innerHTML += '<div class="game-piece" style="background-color: yellow; opacity: 30%; grid-area:' + (possibleMoves[i][1] +1) + "/" + (possibleMoves[i][0] +1) + ';" data-ppid=' + i + '></div>';
        }
    }

    function calcPossibleMoves()
    {
        var [x,y] = selectedGamePiece.position;
        var stackHeight = selectedGamePiece.level;
        var calcPieceArray = [];
        var holderArray = [];

        if (stackHeight == 1)
        {
            (x+1 > boardSize-1) ? null : holderArray.push([x +1 , y]);
            (y+1 > boardSize-1) ? null : holderArray.push([x , y +1]);
            (x-1 < 0) ? null : holderArray.push([x -1 , y]);
            (y-1 < 0) ? null : holderArray.push([x , y -1]);
        }
        else if (stackHeight >= boardSize)
        {
            holderArray.push([x +1, y -1]);
            holderArray.push([x +1, y +1]);
            holderArray.push([x -1, y -1]);
            holderArray.push([x -1, y +1]);

            holderArray.push([x , y -1]);
            holderArray.push([x -1 , y]);
            holderArray.push([x , y +1]);
            holderArray.push([x +1 , y]);
        }
        else
        {
            holderArray.push([x + stackHeight, y]);
            holderArray.push([x - stackHeight, y]);
            holderArray.push([x, y + stackHeight]);
            holderArray.push([x, y - stackHeight]);
        }

        console.log(holderArray);

        // Correct all pos that are off of the board
        calcPieceArray = correctPosArray(holderArray);
        return calcPieceArray;
    }
    
    function drawBackground() {
        const colorName = returnColorTurn();
    
        // Lookup table for pre-calculated lighter background colors
        const backgroundColorTable = {
            red: '#FFCCCC',
            orange: '#f5be58',
            green: '#CCFFCC',
            blue: '#9a9af5',
            violet: '#ce99f7'
            // Add more colors as needed
        };
    
        // Get the pre-calculated lighter background color
        const backgroundColor = backgroundColorTable[colorName.toLowerCase()];
    
        if (backgroundColor) {
            // Set the background of the body
            document.body.style.backgroundColor = backgroundColor;
        } else {
            console.error('Invalid color name:', colorName);
        }
    }
     
}

// Array Functions
{
    // Simpple function to check if two arrays are equal
    function isEqual(arr1, arr2) {
        return arr1.every((val, index) => val === arr2[index]);
    }

    // Correct Positions in a 1D array.
    function correctPosArray(arr) {
        const correctedArray = [];

        for (let i = 0; i < arr.length; i++) {
            const pos = arr[i];
            const correctedPos = correctPosition(pos);
            correctedArray.push(correctedPos);
        }

        return correctedArray;
    }
    // Helper function to correct a single position
    function correctPosition(pos) {
        // Wrap around if x is greater than or equal to board limit
        const correctedX = (pos[0] >= boardSize) ? pos[0] % boardSize :
            (pos[0] < 0) ? (boardSize - Math.abs(pos[0]) % boardSize) :
                pos[0];

        // Wrap around if y is greater than or equal to board limit
        const correctedY = (pos[1] >= boardSize) ? pos[1] % boardSize :
            (pos[1] < 0) ? (boardSize - Math.abs(pos[1]) % boardSize) :
                pos[1];

        return [correctedX, correctedY];
    }






}

// Button Functions
{
    function startButton(){
        nabSettings();
        console.log("Player Count is " + playerCount);
        console.log("Board Type is " + boardType);
        console.log("Board Size is " + boardSize);
        startGame();
        panelVisible("hide");
    }

    function toggleSelectGamePiece(gamePiece, cellDiv) {
        if (gamePiece.owner == returnColorTurn() || gamePiece.owner == "Gay") {
            if (selectedGamePiece == gamePiece) {
                // Unselect the currently selected game piece
                selectedGamePiece = null;
    
                // Remove all elements with a ppID
                const ppElements = document.querySelectorAll('[data-ppid]');
                ppElements.forEach(element => element.remove());
            } else {
                // Select a new game piece
                selectedGamePiece = gamePiece;
    
                // Nab the data-gpID attribute
                const gpID = cellDiv.getAttribute('data-gpID');
                highlightPosition();
            }
        } else {
            alert("It is currently " + returnColorTurn() + "'s turn");
        }  
    }
    

    // Function to move the currently selected game piece
    function moveSelectedPiece(pos) {
        destroyGamePiece(selectedGamePiece);
        console.log(selectedGamePiece);
        BoardUpdateData.push(new GamePiece(pos, selectedGamePiece.level, selectedGamePiece.owner));
        resolveBoardConflicts();
        drawGameBoard();
        checkForWinner();
        turnTracker++;
        drawBackground();

    }
}




// Nabber Functions
{
    // Nabs the current settings
    function nabSettings() {
            playerCount = document.getElementById('playerCount').value,
            boardType = document.getElementById('boardType').value,
            boardSize = document.getElementById('boardType').value === 'custom' ? document.getElementById('boardSize').value : undefined
    }

    // Nabs whatever the user has selected
    // Add a click event listener to the document
    document.addEventListener('click', function(event) {
        // Check if the clicked element is a game piece
        if (event.target.getAttribute('data-gpID')) {
            // Get the data-gpID attribute
            const gpID = event.target.getAttribute('data-gpID');

            // Use the gpID to get the corresponding game piece from BoardData
            const gamePiece = BoardData[gpID];

            // Call the toggleSelectGamePiece function with the selected game piece
            toggleSelectGamePiece(gamePiece, event.target);
        }
        if (event.target.getAttribute('data-ppID')) {
            // Get the data-gpID attribute
            const ppID = event.target.getAttribute('data-ppID');

            // Use the gpID to get the corresponding game piece from BoardData
            const possiblePosition = possibleMoves[ppID];

            // Call the toggleSelectGamePiece function with the selected game piece
            moveSelectedPiece(possiblePosition);
        }
    });

}


// Panel Functions
{
    // Hides or shows the panel
    function panelVisible(visibility) {
        var panel = document.querySelector('.panel');
        var animationHandler = function () {
            panel.style.display = 'none';
            panel.removeEventListener('animationend', animationHandler);

        };

        if (visibility == 'show') {
            boardData = [];
            panel.style.animation = null;
            panel.style.display = 'block';
            panel.removeEventListener('animationend', animationHandler);
            document.body.style.backgroundColor = '#e0e0e0';
        } else if (visibility == 'hide') {
            panel.style.animation = 'slideOut 0.5s ease-in-out';
            panel.addEventListener('animationend', animationHandler);
            drawBackground();
        }
    }
}
