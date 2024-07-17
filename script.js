document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const highScoresList = document.getElementById('highScores');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartButton');
    const blockBreakSound = document.getElementById('blockBreakSound');
    const winSound = document.getElementById('winSound');
    const loseSound = document.getElementById('loseSound');

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
                winSound.play();
                showGameOverMessage('Helal Sana Beah!');
                saveScore();
                displayScores();
            } else {
                piece = randomPiece();
                if (collide(grid, piece)) {
                    gameOver = true;
                    loseSound.play();
                    showGameOverMessage('Başaramadın!');
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

    function rotate(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
    }

    function collide(grid, piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (
                    piece.shape[y][x] &&
                    (grid[y + piece.y] && grid[y + piece.y][x + piece.x]) !== 0
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function merge(grid, piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    grid[y + piece.y][x + piece.x] = colors.indexOf(piece.color) + 1;
                }
            });
        });
    }

    function clearLines() {
        let lines = 0;
        outer: for (let y = grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === 0) {
                    continue outer;
                }
            }
            const row = grid.splice(y, 1)[0].fill(0);
            grid.unshift(row);
            lines++;
            y++;
        }
        if (lines > 0) {
            blockBreakSound.play();
        }
        return lines;
    }

    function calculateScore(lines) {
        if (lines === 1) {
            return 100;
        } else if (lines > 1) {
            return lines * 300;
        }
        return 0;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function saveScore() {
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push(score);
        scores.sort((a, b) => b - a);
        if (scores.length > 3) {
            scores.pop();
        }
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    function displayScores() {
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        highScoresList.innerHTML = scores.map(score => `<li>${score}</li>`).join('');
    }

    function showGameOverMessage(message) {
        gameOverMessage.textContent = message;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'block';
    }

    function restartGame() {
        grid = createGrid(ROWS, COLS);
        score = 0;
        gameOver = false;
        piece = randomPiece();
        gameOverMessage.style.display = 'none';
        restartButton.style.display = 'none';
        updateScore();
        displayScores();
    }

    function update() {
        if (!gameOver) {
            dropPiece();
            drawGrid();
            drawBlock(piece.x, piece.y, piece.shape, piece.color);
            setTimeout(update, 500);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            movePiece(-1);
        } else if (event.key === 'ArrowRight') {
            movePiece(1);
        } else if (event.key === 'ArrowDown') {
            dropPiece();
        } else if (event.key === 'ArrowUp') {
            rotatePiece();
        }
        drawGrid();
        drawBlock(piece.x, piece.y, piece.shape, piece.color);
    });

    document.getElementById('leftButton').addEventListener('click', () => movePiece(-1));
    document.getElementById('rightButton').addEventListener('click', () => movePiece(1));
    document.getElementById('downButton').addEventListener('click', () => dropPiece());
    document.getElementById('rotateButton').addEventListener('click', () => rotatePiece());

    update();
    displayScores();
});
