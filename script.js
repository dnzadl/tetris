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
    const BLOCK_SIZE = 30;
    const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan'];
    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let currentPiece, score = 0;
    let intervalId;
    let startX, startY;
    let playerName = localStorage.getItem('playerName') || '';
    const savedScores = JSON.parse(localStorage.getItem('tetrisScores')) || [];

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
        newPiece();
    }

    function clearLines() {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(value => value)) {
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                score += 100;
                updateScore();
                y++;
            }
        }
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function drawGame() {
        drawBoard();
        drawPiece(currentPiece, currentPiece.x, currentPiece.y, COLORS[currentPiece.color - 1]);
    }

    function newPiece() {
        currentPiece = { ...generatePiece(), x: Math.floor(COLS / 2) - 1, y: 0 };
        if (!isValidPosition(currentPiece)) {
            gameOver();
        }
        drawGame();
    }

    function gameOver() {
        clearInterval(intervalId);
        gameOverMessage.textContent = score >= 2000 ? 'Tebrikler Başardınız!' : 'Üzgünüm Yeterli Değilsiniz';
        gameOverMessage.style.display = 'block';
        saveScore();
        setTimeout(showStartScreen, 3000);
    }

    function saveScore() {
        savedScores.push({ name: playerName, score });
        savedScores.sort((a, b) => b.score - a.score);
        if (savedScores.length > 5) {
            savedScores.pop();
        }
        localStorage.setItem('tetrisScores', JSON.stringify(savedScores));
    }

    function startGame() {
        score = 0;
        updateScore();
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        newPiece();
        gameOverMessage.style.display = 'none';
        gameContainer.style.display = 'block';
        intervalId = setInterval(() => movePiece(0, 1), 200); // Speed: Adjust this for game speed
    }

    function showStartScreen() {
        startScreen.style.display = 'block';
        scoresScreen.style.display = 'none';
        gameContainer.style.display = 'none';
    }

    function showScoresScreen() {
        startScreen.style.display = 'none';
        scoresScreen.style.display = 'block';
        scoresList.innerHTML = '';
        savedScores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            scoresList.appendChild(li);
        });
    }

    function handleKeyDown(event) {
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
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }

    function handleTouchMove(event) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 30) {
                movePiece(1, 0); // Sağ hareket
            } else if (deltaX < -30) {
                movePiece(-1, 0); // Sol hareket
            }
        } else {
            if (deltaY > 30) {
                movePiece(0, 1); // Aşağı hareket
            } else if (deltaY < -30) {
                rotatePiece(); // Döndürme
            }
        }
        startX = touch.clientX;
        startY = touch.clientY;
    }

    startButton.addEventListener('click', () => {
        if (playerNameInput.value) {
            playerName = playerNameInput.value;
            localStorage.setItem('playerName', playerName);
            playerNameSection.style.display = 'none';
            startGame();
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
});
