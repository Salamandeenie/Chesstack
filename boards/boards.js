function call_Board(type, playerCount)
{
    board = new Board()

    if (type === "chess")
    {
        if (playerCount == 2)
        {
            board.size = 8;
            board.createRow(4, new Stack(new Position(0,0), 2, "orange"), false, 1);
            board.createRow(4, new Stack(new Position(4,0), 5, "orange"), false, -1);
            board.createRow(8, new Stack(new Position(0,1), 1, "orange"), false, 0);
            
    
            board.createRow(4, new Stack(new Position(0,7), 2, "blue"), false, 1);
            board.createRow(4, new Stack(new Position(4,7), 5, "blue"), false, -1);
            board.createRow(8, new Stack(new Position(0,6), 1, "blue"), false, 0);
    
            board.players.push("blue");
            board.players.push("orange");
    
            return board;
        }

        if (playerCount == 4)
        {
            board.size = 12;
            board.createRow(4, new Stack(new Position(2,0), 2, "orange"), false, 1);
            board.createRow(4, new Stack(new Position(6,0), 5, "orange"), false, -1);
            board.createRow(8, new Stack(new Position(2,1), 1, "orange"), false, 0);
            
    
            board.createRow(4, new Stack(new Position(2,11), 2, "blue"), false, 1);
            board.createRow(4, new Stack(new Position(6,11), 5, "blue"), false, -1);
            board.createRow(8, new Stack(new Position(2,10), 1, "blue"), false, 0);

            board.createRow(4, new Stack(new Position(0,2), 2, "green"), true, 1);
            board.createRow(4, new Stack(new Position(0,6), 5, "green"), true, -1);
            board.createRow(8, new Stack(new Position(1,2), 1, "green"), true, 0);

            board.createRow(4, new Stack(new Position(11,2), 2, "violet"), true, 1);
            board.createRow(4, new Stack(new Position(11,6), 5, "violet"), true, -1);
            board.createRow(8, new Stack(new Position(10,2), 1, "violet"), true, 0);

            
    
            board.players.push("blue");
            board.players.push("violet");
            board.players.push("orange");
            board.players.push("green");
    
            return board;
        }

    }

    else if (type === "uniformCustom")
    {

    }
}