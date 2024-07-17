document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const lastScoresList = document.getElementById('last-scores');
    const startButton = document.getElementById('start-button');
    const ROWS = 20;
    const COLS = 10;
    const EMPTY = 'white';
    let board = [];
    let currentShape;
    let currentShapePosition;
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
                square.style.width = '30px';
                square.style.height = '30px';
                grid.appendChild(square);
            });
        });
    }

    // Generate a random Tetris shape
    function randomShape() {
        const randomIndex = Math.floor(Math.random() * shapes.length);
        return shapes[randomIndex];
    }

    // Place current shape on the board
    function drawShape() {
        currentShapePosition.forEach((pos) => {
            const [x, y] = pos;
            board[y][x] = currentShape.color;
        });
    }

    // Clear current shape from the board
    function clearShape() {
        currentShapePosition.forEach((pos) => {
            const [x, y] = pos;
            board[y][x] = EMPTY;
        });
    }

    // Move current shape down
    function moveDown() {
        clearShape();
        currentShapePosition = currentShapePosition.map((pos) => [pos[0], pos[1] + 1]);
        drawShape();
    }

    // Move current shape left
    function moveLeft() {
        clearShape();
        currentShapePosition = currentShapePosition.map((pos) => [pos[0] - 1, pos[1]]);
        drawShape();
    }

    // Move current shape right
    function moveRight() {
        clearShape();
        currentShapePosition = currentShapePosition.map((pos) => [pos[0] + 1, pos[1]]);
        drawShape();
    }

    // Rotate current shape
    function rotateShape() {
        const rotatedShape = [];
        currentShape.shape.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (!rotatedShape[colIndex]) {
                    rotatedShape[colIndex] = [];
                }
                rotatedShape[colIndex][row.length - 1 - rowIndex] = col;
            });
        });
        currentShape.shape = rotatedShape;
    }

    // Check collision
    function checkCollision() {
        return currentShapePosition.some((pos) => {
            const [x, y] = pos;
            return y >= ROWS || x < 0 || x >= COLS || board[y][x] !== EMPTY;
        });
    }

    // Game over function
    function gameOver() {
        if (score >= 2000) {
            alert("Tebrikler Başardın!");
        } else {
            alert("Daha çok çabalamalısın!");
        }
        lastScores.unshift(score);
        lastScores = lastScores.slice(0, 3);
        displayLastScores();
        score = 0;
        updateScore();
        init();
        drawBoard();
        startButton.disabled = false; // Enable start button
    }

    // Update score display
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // Display last 3 scores
    function displayLastScores() {
        lastScoresList.innerHTML = '';
        lastScores.forEach((score) => {
            const li = document.createElement('li');
            li.textContent = score;
            lastScoresList.appendChild(li);
        });
    }

    // Add key events for controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowDown') {
            moveDown();
        } else if (e.key === 'ArrowUp') {
            rotateShape();
        }
    });

    // Add click event for start button
    startButton.addEventListener('click', () => {
        startGame();
        startButton.disabled = true; // Disable start button once game starts
    });

    // Initialize the game
    function startGame() {
        init();
        drawBoard();
        currentShape = randomShape();
        currentShapePosition = [[3, 0]]; // Initial position
        drawShape();
        gameLoop();
    }

    // Game loop
    function gameLoop() {
        moveDown();
        if (checkCollision()) {
            // If collision happens, place shape on board and check lines
            currentShapePosition.forEach((pos) => {
                const [x, y] = pos;
                if (y >= 0) {
                    board[y][x] = currentShape.color;
                }
            });
            checkLines();
            // Generate new shape
            currentShape = randomShape();
            currentShapePosition = [[3, 0]]; // Initial position
            // Check if new shape causes immediate collision (game over)
            if (checkCollision()) {
                gameOver();
                return; // Exit function to prevent further looping
            }
        }
        drawShape();
        setTimeout(gameLoop, 1000); // Drop speed
    }

    // Check and clear full lines
    function checkLines() {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every((col) => col !== EMPTY)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(EMPTY));
                score += 100;
                updateScore();
            }
        }
    }

    // Display last 3 scores initially
    displayLastScores();

    // Start the game initially
    startGame();
});
