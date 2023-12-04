function startGame(playerCount, boardType, boardSize) {
    // Function doesn't do anything yet, you can add your game logic here
    console.log('Starting the game with:', playerCount, boardType, boardSize);
    }

    function nabSettings() {
    return {
        playerCount: document.getElementById('playerCount').value,
        boardType: document.getElementById('boardType').value,
        boardSize: document.getElementById('boardType').value === 'custom' ? document.getElementById('boardSize').value : undefined
    };
    }

    function panelVisible(visibility) {
    var panel = document.querySelector('.panel');
    if (visibility === 'show') {
        panel.style.display = 'block';
    } else {
        panel.style.animation = 'slideOut 0.5s ease-in-out';
        panel.addEventListener('animationend', function () {
        panel.style.display = 'none';
        });
    }
    }

    // Set default values
    document.getElementById('playerCount').value = '2';
    document.getElementById('boardType').value = 'chess';

    // Event listener for board type change
    document.getElementById('boardType').addEventListener('change', function () {
    var boardSizeContainer = document.getElementById('boardSizeContainer');
    boardSizeContainer.style.display = this.value === 'custom' ? 'block' : 'none';
});