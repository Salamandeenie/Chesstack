//? The basic Position object
class Position
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

//? Stack Definition
class Stack
{
    constructor(position = new Position(), stackHeight = 1, owner = null, type = "standard")
    {
        this.position = position;
        this.height = stackHeight;
        this.owner = owner;
        this.type = type;
    }

    clone(){ return new Stack(this.position, this.height, this.owner, this.type) }

    PossibleMoves(boardRef)
    {
        const board = boardRef;
        const {x, y} = this.position;
        const height = this.height;

        var calcPieceArray = []
        var tempArray = []

        if (height == 1)
        {
            // Check cardinal
            (x + 1 > board.size - 1) ? null : tempArray.push(new Position(x + 1, y));
            (y + 1 > board.size - 1) ? null : tempArray.push(new Position(x, y + 1));
            (x - 1 < 0) ? null : tempArray.push(new Position(x - 1, y));
            (y - 1 < 0) ? null : tempArray.push(new Position(x, y - 1));

            // Check diagonal
            (x + 1 > board.size - 1 || y - 1 < 0) ? null : tempArray.push(new Position(x + 1, y - 1));
            (x - 1 < 0 || y - 1 < 0) ? null : tempArray.push(new Position(x - 1, y - 1));
            (x + 1 > board.size - 1 || y + 1 > board.size - 1) ? null : tempArray.push(new Position(x + 1, y + 1));
            (x - 1 < 0 || y + 1 > board.size - 1) ? null : tempArray.push(new Position(x - 1, y + 1));
        }

        else if ((height >= board.size) || height == '≡')
        {
            for (let i = 1; i < board.size; i++)
            {
                tempArray.push(new Position(x + i, y));
                tempArray.push(new Position(x - i, y));
                tempArray.push(new Position(x, y + i));
                tempArray.push(new Position(x, y - i));
            }
        }

        else
        {
            tempArray.push(new Position(x + height, y));
            tempArray.push(new Position(x - height, y));
            tempArray.push(new Position(x, y + height));
            tempArray.push(new Position(x, y - height));
        }

        // Correct all positions that are off the board so things are a-ok to go
        calcPieceArray = correctPosArray(tempArray, boardRef);
        return calcPieceArray;
    }
}

//? Board Definition
class Board
{
    constructor(ref = document.getElementById('game-board'))
    {
        this.size = 8;

        this.selectedStack = null;
        this.possibleMoves = []; // The possible moves of the selected stack

        this.data = [];
        this.updateData = [];

        this.turnCount = 0;
        this.players = [];

        this.ref = ref;
    }

    // Returns whose turn it is using the turn count, and the player array
    colorTurn() {return this.players[(this.turnCount % this.players.length)]}

    createRow(length = this.size, stackStart = new Stack(), isVertical = false, incrementBy = 0)
    {
        for (let i = 0; i < length; i++)
        {
            let position;

            if (isVertical) { position = new Position(stackStart.position.x, stackStart.position.y + i) }
            else { position = new Position(stackStart.position.x + i, stackStart.position.y) }

            const stack = stackStart.clone();
            stack.position = position;
            stack.height = stackStart.height + (i * incrementBy)
            // Push each stack
            this.updateData.push(stack);
            console.log(this)
        }

        this.resolveBoardConflicts();
    }

    resolveBoardConflicts()
    {
        for (let i = 0; i < this.updateData.length; i++) // Corrected loop
        {
            const stack = this.updateData[i];
    
            // Wrap around if x or y is greater than or equal to the board limit
            if (stack.position.x >= this.size) { stack.position.x %= this.size; }
            if (stack.position.y >= this.size) { stack.position.y %= this.size; }
    
            // Wrap around if x or y is less than 0
            if (stack.position.x < 0) { stack.position.x = (this.size - Math.abs(stack.position.x)) % this.size; }
            if (stack.position.y < 0) { stack.position.y = (this.size - Math.abs(stack.position.y)) % this.size; }
    
            // Check for other conflicts with existing pieces in Board data
            const existingStack = this.data.find(piece => isEqual(piece.position, stack.position));
    
            if (existingStack)
            {
                // There was a conflict, and now we resolve it here
                (stack.height + existingStack.height) < this.size ? stack.height += existingStack.height : stack.height = '≡';
    
                // Remove the existing piece from the board data
                this.destroyStack(existingStack);
            }
    
            // Add the resolved piece to the board data
            this.data.push(stack);
        }
    
        // Clear the update array after resolving conflicts
        this.updateData = [];
        drawGameBoard();
    }
    

    winCheck()
    {
        // Create a mapping of what owners exist according to the data array
        const uniqueOwners = [...new Set(this.data.map(piece => piece.owner))];

        this.players = this.players.filter(color => uniqueOwners.includes(color));

        if (this.players.length === 1)
        {
            const winner = this.players[0];
            alert(`${winner} has won the game!`);
            location.reload();
        }

        this.turnCount++;
        return false; // No winner yet. . .
    }

    destroyStack(stack) 
    {
        // Find the index of the stack within data using the isEqual function
        const index = this.data.findIndex(piece => isEqual(piece.position, stack.position));
    
        // If found, remove it from the array
        if (index !== -1) {
            console.log(`Destroying stack at position: ${stack.position.x}, ${stack.position.y}`);
            this.data.splice(index, 1);
        } else {
            console.log("ERROR - Selected stack could not be found within memory!");
        }
    
        // Debugging: Output the remaining stacks
        console.log("Remaining stacks in board.data:");
        this.data.forEach((piece, idx) => {
            console.log(`Index ${idx}: Position (${piece.position.x}, ${piece.position.y})`);
        });
    }
    
}