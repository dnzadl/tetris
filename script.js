document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const highScoresList = document.getElementById('highScores');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartButton');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const canvasWidth = COLS * BLOCK_SIZE;
    const canvasHeight = ROWS * BLOCK_SIZE;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const controlsContainer = document.getElementById('controls');
    const buttonWidth = 50;
    const buttonHeight = 50;
    const buttonMargin = 10;
    const controlsWidth = (buttonWidth + buttonMargin) * 4;
    const controlsHeight = buttonHeight;

    controlsContainer.style.width = `${controlsWidth}px`;
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.left = `${(canvasWidth - controlsWidth) / 2}px`;
    controlsContainer.style.top = `${canvasHeight + 20}px`;

    let score = 0;
    let gameOver = false;

    const colors = ['#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];
    const shapes = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1, 1], [0, 0, 1]],
    ];

    let grid = createGrid(ROWS, COLS);

    function createGrid(rows, cols) {
        const grid = [];
        for (let row = 0; row < rows; row++) {
            grid.push(new Array(cols).fill(0));
        }
        return grid;
    }

    function drawGrid() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    context.fillStyle = colors[value - 1];
                    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    function drawBlock(x, y, shape, color) {
        context.fillStyle = color;
        shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value > 0) {
                    context.fillRect((x + dx) * BLOCK_SIZE, (y + dy) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    function randomPiece() {
        const index = Math.floor(Math.random() * shapes.length);
        return {
            shape: shapes[index],
            color: colors[index],
            x: Math.floor(COLS / 2) - 1,
            y: 0,
        };
    }

    let piece = randomPiece();

    function movePiece(dir) {
        piece.x += dir;
        if (collide(grid, piece)) {
            piece.x -= dir;
        }
    }

    function dropPiece() {
        piece.y++;
        if (collide(grid, piece)) {
            piece.y--;
            merge(grid, piece);
            const lines = clearLines();
            score += calculateScore(lines);
            updateScore();
            if (score >= 2000) {
                gameOver = true;
                showGameOverMessage('Tebrikler Başardın!');
                saveScore();
                displayScores();
            } else {
                piece = randomPiece();
                if (collide(grid, piece)) {
                    gameOver = true;
                    showGameOverMessage('Daha çok çabalamalısın!');
                    saveScore();
                    displayScores();
                }
            }
        }
    }

    function rotatePiece() {
        const rotatedPiece = rotate(piece.shape);
        if (!collide(grid, { ...piece, shape: rotatedPiece })) {
            piece.shape = rotatedPiece;
        }
    }

    function rotate(shape) {
        const rotatedShape = shape.map((row, y) =>
            row.map((_, x) => shape[x][shape.length - 1 - y])
        );
        return rotatedShape;
    }

    function collide(grid, piece) {
        const { shape, x, y } = piece;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] > 0) {
                    const newX = x + col;
                    const newY = y + row;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || grid[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function merge(grid, piece) {
        const { shape, x, y } = piece;
        shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value > 0) {
                    grid[y + dy][x + dx] = value;
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (grid[row].every(cell => cell !== 0)) {
                grid.splice(row, 1);
                grid.unshift(new Array(COLS).fill(0));
                linesCleared++;
                row++;
            }
        }
        return linesCleared;
    }

    function calculateScore(lines) {
        switch (lines) {
            case 1:
                return 100;
            case 2:
                return 300;
            case 3:
                return 500;
            case 4:
                return 800;
            default:
                return 0;
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function showGameOverMessage(message) {
        gameOverMessage.textContent = message;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'block';
    }

    function restartGame() {
        grid = createGrid(ROWS, COLS);
        score = 0;
        updateScore();
        piece = randomPiece();
        gameOver = false;
        gameOverMessage.style.display = 'none';
        restartButton.style.display = 'none';
        draw();
    }

    function saveScore() {
        const scores = JSON.parse(localStorage.getItem('tetrisScores')) || [];
        scores.push(score);
        localStorage.setItem('tetrisScores', JSON.stringify(scores));
    }

    function displayScores() {
        const scores = JSON.parse(localStorage.getItem('tetrisScores')) || [];
        scores.sort((a, b) => b - a); // Sort in descending order
        const highScores = scores.slice(0, 3); // Get top 3 scores
        highScoresList.innerHTML = highScores.map((score, index) => `<li>High Score ${index + 1}: ${score}</li>`).join('');
    }

    document.addEventListener('keydown', (event) => {
        if (!gameOver) {
            if (event.key === 'ArrowLeft') {
                movePiece(-1);
            } else if (event.key === 'ArrowRight') {
                movePiece(1);
            } else if (event.key === 'ArrowDown') {
                dropPiece();
            } else if (event.key === 'ArrowUp') {
                rotatePiece();
            }
        }
    });

    function draw() {
        drawGrid();
        drawBlock(piece.x, piece.y, piece.shape, piece.color);
        if (!gameOver) {
            setTimeout(() => {
                dropPiece();
                if (!gameOver) {
                    draw();
                }
            }, 500); // Set drop speed here (in milliseconds)
        }
    }

    draw();
});
