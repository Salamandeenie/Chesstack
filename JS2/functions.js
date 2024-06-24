//? Board Functions
function startGame()
{
    // Slide out the panel
    const panel = document.querySelector('.panel');
    panel.classList.add('slide-out');

    // Fade the screen to black
    fadeScreen(500); // Adjust duration as needed

    // Wait for the animation and fade effect to complete
    setTimeout(() => {
        // Draw the board with the current turn's color
        board = call_Board(boardType, playerCount);
        // Enable board display
        board.ref.style.display = "grid";
        drawBackground(board.colorTurn());
    }, 600); // Adjust timing to match the fadeScreen duration + additional delay
}

//? Draws the game board
function drawGameBoard()
{
    board.ref.innerHTML = '';
    board.ref.style.width = 3.63 * board.size + 'vw';
    board.ref.style.height = 3.63 * board.size + 'vw';

    // Loop through all positions of the board
    for (let row = 0; row < board.size; row++) 
    {
        //? Handles space drawing
        for (let col = 0; col < board.size; col++)
        {
            const space = document.createElement('div');
            space.className = 'empty-space square';

            // Add 1, as the grid system starts at 1
            space.style.gridColumn = col + 1;
            space.style.gridRow = row + 1;

            // Add the space to the board
            board.ref.appendChild(space);
        }

        //? Handles stack drawing
        for (let col = 0; col < board.size; col++)
        {
            const position = new Position(col, row);

            // Check the board piece array for pieces at this position
            const hasStack = board.data.some(piece => isEqual(piece.position, position));

            // Create a div element for the thing
            const space = document.createElement('div');

            space.style.gridColumn = col + 1;
            space.style.gridRow = row + 1;

            // If there is a game piece, render it; otherwise, move on.
            if (hasStack)
            {
                space.className = 'game-piece';
                const piece = board.data.find(piece => isEqual(piece.position, position));
                space.style.backgroundColor = piece.owner.toLowerCase();
                space.innerText = piece.height;

                // Add the data attribute to store the index
                space.setAttribute('data-gpID', board.data.indexOf(piece));

                // Add the space (game piece) to the board
                board.ref.appendChild(space);
            }
        }
    }
}
function drawBackground(color)
{
    const shades = generateShades(color);
    animateColors(shades[0], shades[1], shades[2], shades[3]) 
}

//> General Functions

//? Compares two objects. If identical, return true. Otherwise, return false.
function isEqual(obj1, obj2)
{
    // Check :: Are the objects given the same type
    if (typeof obj1 !== typeof obj2 || typeof obj1 === 'function') { return false }

    // Process Arrays separately
    if (Array.isArray(obj1)) { return obj1.every((val, index) => val === obj2[index]) }

    // Handle objects
    if (typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 !== null && obj2 !== null) 
    {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Check for the same number of properties
        if (keys1.length !== keys2.length) 
        {
            return false;
        }

        // Loop through each of the keys and compare values recursively
        for (const key of keys1) 
        {
            if (!isEqual(obj1[key], obj2[key])) 
            {
                return false;
            }
        }

        // If every property matches up, then obj1 === obj2
        return true;
    }
    
        // Direct value comparison for non-object types (including null and undefined)
        return obj1 === obj2;
}

//? Utilizes the correct position function to correct an entire array
function correctPosArray(arr, board)
{
    const correctedArray = []
    const selectedStack = board.selectedStack;

    for (let i = 0; i < arr.length; i++)
    {
        const pos = arr[i];
        const correctedPos = correctPosition(pos, board);
        
        selectedStack.position != correctedPos ? correctedArray.push(correctedPos) : console.log("[CorrectPieceArray] : Same Position Detected! Disregarding duplicate.");
    }

    return correctedArray;
}

//? Helper function for correct position array
function correctPosition(pos, board)
{
    // Wrap around if x is greater than, or equal to the board's limit
    const correctX = (pos.x >= board.size) ? pos.x % board.size :
    (pos.x < 0) ? (board.size - Math.abs(pos.x) % board.size)   : pos.x;

    // Wrap around if y is greater than, or equal to the board's limit
    const correctY = (pos.y >= board.size) ? pos.y % board.size :
    (pos.y < 0) ? (board.size - Math.abs(pos.y) % board.size)   : pos.y;

    return new Position(correctX, correctY);
}

function toggleSelectStack(stack, cellDiv)
{
    if (stack.owner == board.colorTurn() || stack.owner == "any")
    {
        if (board.selectedStack == stack)
        {
            // Unselect the currently selected game piece
            board.selectedStack = null;

            // Remove all elements with a ppID
            const ppElements = document.querySelectorAll('[data-ppid]');
            ppElements.forEach(element => element.remove());
        }

        else
        {
            // Select a new game piece
            board.selectedStack = stack;

            // Nab the data-gpID attribute
            const gpId = cellDiv.getAttribute('data-gpID');
            highlightPositions();
        }
    }
    else { alert(`It is currently ${board.colorTurn()}'s turn`)};
}

//? Highlights the possible positions of the selected stack
function highlightPositions()
{
    // Remove all elements that have a ppID (possible position: ID)
    const ppElements = document.querySelectorAll('[data-ppid]');
    ppElements.forEach(element => element.remove());

    possibleMoves = board.selectedStack.PossibleMoves(board);
    board.possibleMoves = possibleMoves;

    for (let i = 0; i < possibleMoves.length; i++)
    {
        document.getElementById('game-board').innerHTML += '<div class="game-piece" style="background-color: yellow; opacity: 30%; grid-area:' + (possibleMoves[i].y +1) + "/" + (possibleMoves[i].x +1) + ';" data-ppid=' + i + '></div>';    
    }
}

function moveSelectedStack(pos)
{
    board.destroyStack(board.selectedStack);
    board.updateData.push(new Stack(pos, board.selectedStack.height, board.selectedStack.owner));

    board.resolveBoardConflicts();
    drawGameBoard();
    board.winCheck();
    drawBackground(board.colorTurn());
}

//> Nabbers and Listeners

//? Grabs whatever the user has selected
// Add a click event listener to the document
document.addEventListener('click', function(event)
{
    // Check if the clicked element has the game piece identifier
    if (event.target.getAttribute('data-gpID'))
    {
        // Get the data-gpID attribute
        const gpID = event.target.getAttribute('data-gpID');

        // Use the gpIID to get the corresponding game piece from BoardData
        const stack = board.data[gpID];

        // Call the toggleSelectStack function with the selected stack
        toggleSelectStack(stack, event.target);
    }

    if (event.target.getAttribute('data-ppID'))
    {
        // Get the data-gpID attribute
        const ppID = event.target.getAttribute('data-ppID');

        // Use the gpID to get the corresponding game piece from board.data
        const possiblePosition = board.possibleMoves[ppID];

        // Call the moveSelectedStack to move and resolve the piece
        moveSelectedStack(possiblePosition);
    }
})
