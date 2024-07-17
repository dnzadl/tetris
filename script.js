document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const lastScoresList = document.getElementById('last-scores');
    const ROWS = 20;
    const COLS = 10;
    const EMPTY = 'white';
    let board = [];
    let score = 0;
    let lastScores = [];

    // Tetris block shapes and colors
    const shapes = [
        { color: '#FF4136', shape: [ [1, 1, 1, 1] ] },
        { color: '#FF851B', shape: [ [1, 1], [1, 1] ] },
        { color: '#FFDC00', shape: [ [1, 1, 1], [0, 1, 0] ] },
        { color: '#39CCCC', shape: [ [1, 1, 1], [1, 0, 0] ] },
        { color: '#0074D9', shape: [ [1, 1, 1], [0, 0, 1] ] },
        { color: '#B10DC9', shape: [ [1, 1, 0], [0, 1, 1] ] },
        { color: '#3D9970', shape: [ [0, 1, 1], [1, 1, 0] ] }
    ];

    // Initialize game board
    function init() {
        for (let row = 0; row < ROWS; row++) {
            board[row] = [];
            for (let col = 0; col < COLS; col++) {
                board[row][col] = EMPTY;
            }
        }
    }

    // Draw the board
    function drawBoard() {
        grid.innerHTML = '';
        board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                const square = document.createElement('div');
                square.style.backgroundColor = board[rowIndex][colIndex];
                square.style.border = '1px solid #333';
                square.style.width = 'calc(100% / 10)';
                square.style.height = 'calc(100% / 20)';
                grid.appendChild(square);
            });
        });
    }

    // Generate a random Tetris shape
    function randomShape() {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        return shapes[randomIndex];
    }

    // Start the game
    function startGame() {
        init();
        drawBoard();
        // Your game logic here
    }

    // Update score display
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // Display last 3 scores
    function displayLastScores() {
        lastScoresList.innerHTML = '';
        lastScores.slice(0, 3).forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = score;
            lastScoresList.appendChild(li);
        });
    }

    // Game over function
    function gameOver() {
        // Handle game over logic
        if (score >= 2000) {
            alert("Tebrikler Başardın!");
        } else {
            alert("Daha çok çabalamalısın!");
        }
        lastScores.unshift(score);
        displayLastScores();
        score = 0;
        updateScore();
        init();
        drawBoard();
    }

    // Add key events for controls (using arrow emojis)
    document.addEventListener('keydown', (e) => {
        // Your control logic here
    });

    // Initialize the game
    startGame();
});
