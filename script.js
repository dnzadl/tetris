document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const scoresList = document.getElementById('scores-list');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const scoresButton = document.getElementById('scores-button');
    const backButton = document.getElementById('back-button');
    const saveNameButton = document.getElementById('save-name');
    const playerNameInput = document.getElementById('player-name');
    const startScreen = document.getElementById('start-screen');
    const scoresScreen = document.getElementById('scores-screen');
    const gameContainer = document.getElementById('game-container');
    const playerNameSection = document.getElementById('player-name-section');
    const gameOverMessage = document.getElementById('game-over-message');

    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30; // Taş boyutu
    const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan'];
    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let currentPiece, score = 0;
    let intervalId;
    let touchStartX, touchStartY;
    let playerName = localStorage.getItem('playerName') || '';
    let gameStarted = false;

    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;

    if (playerName) {
        showStartScreen();
    } else {
        playerNameSection.style.display = 'block';
        startScreen.style.display = 'none';
    }

    function drawBlock(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x]) {
                    drawBlock(x, y, COLORS[board[y][x] - 1]);
                }
            }
        }
    }

    function drawPiece(piece, offsetX, offsetY, color) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    drawBlock(x + offsetX, y + offsetY, color);
                }
            });
        });
    }

    function generatePiece() {
        const shapes = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[0, 1, 1], [1, 1, 0]], // Z
            [[1, 1, 0], [0, 1, 1]], // S
            [[1, 1, 1], [0, 1, 0]], // T
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]] // J
        ];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = Math.floor(Math.random() * COLORS.length) + 1;
        return { shape, color };
    }

    function movePiece(dx, dy) {
        const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };
        if (isValidPosition(newPiece)) {
            currentPiece = newPiece;
            drawGame();
        } else if (dy > 0) {
            mergePiece(); // Merge piece into board if moved down and invalid
        }
    }

    function rotatePiece() {
        const newPiece = { ...currentPiece, shape: rotateMatrix(currentPiece.shape) };
        if (isValidPosition(newPiece)) {
            currentPiece = newPiece;
            drawGame();
        }
    }

    function rotateMatrix(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
    }

    function isValidPosition(piece) {
        return piece.shape.every((row, y) =>
            row.every((value, x) =>
                !value || (
                    piece.y + y >= 0 &&
                    piece.x + x >= 0 &&
                    piece.x + x < COLS &&
                    piece.y + y < ROWS &&
                    !board[piece.y + y][piece.x + x]
                )
            )
        );
    }

    function mergePiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
                }
            });
        });
        clearLines();
        currentPiece = generatePiece();
        currentPiece.x = Math.floor(COLS / 2) - 1;
        currentPiece.y = 0;
        if (!isValidPosition(currentPiece)) {
            endGame();
        }
    }

    function clearLines() {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                score += 100;
                drawBoard();
            }
        }
        scoreElement.textContent = `Score: ${score}`;
    }

    function drawGame() {
        drawBoard();
        drawPiece(currentPiece, currentPiece.x, currentPiece.y, COLORS[currentPiece.color - 1]);
    }

    function startGame() {
        gameStarted = true;
        score = 0;
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        currentPiece = generatePiece();
        currentPiece.x = Math.floor(COLS / 2) - 1;
        currentPiece.y = 0;
        scoreElement.textContent = `Score: ${score}`;
        gameOverMessage.textContent = '';
        startScreen.style.display = 'none';
        scoresScreen.style.display = 'none';
        gameContainer.style.display = 'block';

        clearInterval(intervalId);
        intervalId = setInterval(() => movePiece(0, 1), 600); // Speed: 600ms
    }

    function endGame() {
        clearInterval(intervalId);
        gameStarted = false;
        gameOverMessage.textContent = 'Game Over';
        saveScore();
    }

    function saveScore() {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({ name: playerName, score });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5); // Keep top 5 scores
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    function showScoresScreen() {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'none';
        scoresScreen.style.display = 'block';
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scoresList.innerHTML = scores.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
    }

    function showStartScreen() {
        startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        scoresScreen.style.display = 'none';
    }

    function handleKeyDown(event) {
        if (!gameStarted) return;
        switch (event.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
        }
    }

    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (!gameStarted) return;
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 30) {
                movePiece(1, 0); // Right move
            } else if (deltaX < -30) {
                movePiece(-1, 0); // Left move
            }
        } else {
            if (deltaY > 30) {
                movePiece(0, 1); // Down move
            } else if (deltaY < -30) {
                rotatePiece(); // Rotate
            }
        }

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchEnd() {
        if (gameStarted) {
            movePiece(0, 1); // Move piece down
        }
    }

    startButton.addEventListener('click', () => {
        if (!gameStarted && playerName) {
            startGame();
        } else if (!playerName) {
            playerNameSection.style.display = 'block';
        }
    });

    saveNameButton.addEventListener('click', () => {
        if (playerNameInput.value) {
            playerName = playerNameInput.value;
            localStorage.setItem('playerName', playerName);
            playerNameSection.style.display = 'none';
            showStartScreen();
        }
    });

    restartButton.addEventListener('click', startGame);
    scoresButton.addEventListener('click', showScoresScreen);
    backButton.addEventListener('click', showStartScreen);
    document.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
});
