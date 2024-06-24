document.addEventListener("DOMContentLoaded", function (){
    console.log(BoardData);

    // Event listener for board type change
    document.getElementById('boardType').addEventListener('change', function () {
        var boardSizeContainer = document.getElementById('boardSizeContainer');
        boardSizeContainer.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    document.getElementById('playerCount').value = '2';
    document.getElementById('boardType').value = 'chess';

    
});