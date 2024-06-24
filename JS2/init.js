function startButton()
{
    playerCount = document.getElementById("playerCount").value;
    boardSize = document.getElementById("boardSize").value ? document.getElementById("boardSize").value : undefined;
    boardType = document.getElementById("boardType").value;

    startGame();
}