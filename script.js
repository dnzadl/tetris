// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-button');
    const scoresButton = document.getElementById('scores-button');
    const restartButton = document.getElementById('restart-button');
    const backButton = document.getElementById('back-button');
    const backToStartButton = document.getElementById('back-to-start-button');
    const saveNameButton = document.getElementById('save-name');
    const playerNameInput = document.getElementById('player-name');
    const gameOverMessage = document.getElementById('game-over-message');
    const scoreDisplay = document.getElementById('score');
    const gameArea = document.getElementById('game-area');
    const controls = document.getElementById('controls');

    let game;
    let playerName = '';

    function initializeGame() {
        canvas.width = 240; // Oyun alanını daha küçük yapıyoruz
        canvas.height = 400;
        game = new Tetris(ctx, canvas);
        updateScore(0);
        gameOverMessage.textContent = '';
        game.start();
    }

    function updateScore(score) {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function startGame() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('player-name-section').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('scores-screen').style.display = 'none';
        initializeGame();
    }

    function showScores() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('player-name-section').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('scores-screen').style.display = 'block';
    }

    function showStartScreen() {
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('player-name-section').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('scores-screen').style.display = 'none';
    }

    function handleRotate() {
        if (game) game.rotate();
    }

    function handleMoveLeft() {
        if (game) game.moveLeft();
    }

    function handleMoveRight() {
        if (game) game.moveRight();
    }

    function handleMoveDown() {
        if (game) game.moveDown();
    }

    function restartGame() {
        game.restart();
        updateScore(0);
        gameOverMessage.textContent = '';
    }

    function handleSaveName() {
        playerName = playerNameInput.value;
        localStorage.setItem('playerName', playerName);
        startGame();
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    scoresButton.addEventListener('click', showScores);
    restartButton.addEventListener('click', restartGame);
    backButton.addEventListener('click', showStartScreen);
    backToStartButton.addEventListener('click', showStartScreen);
    saveNameButton.addEventListener('click', handleSaveName);

    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowLeft':
                handleMoveLeft();
                break;
            case 'ArrowRight':
                handleMoveRight();
                break;
            case 'ArrowDown':
                handleMoveDown();
                break;
            case 'ArrowUp':
                handleRotate();
                break;
        }
    });

    // Mobile controls
    document.getElementById('rotate-button').addEventListener('click', handleRotate);
    document.getElementById('left-button').addEventListener('click', handleMoveLeft);
    document.getElementById('right-button').addEventListener('click', handleMoveRight);
    document.getElementById('down-button').addEventListener('click', handleMoveDown);

    // Tetris game class
    class Tetris {
        constructor(ctx, canvas) {
            this.ctx = ctx;
            this.canvas = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
            this.score = 0;
            this.gameOver = false;
            this.init();
        }

        init() {
            this.board = this.createEmptyBoard();
            this.currentPiece = this.randomPiece();
            this.draw();
        }

        createEmptyBoard() {
            const board = [];
            for (let row = 0; row < 20; row++) {
                board[row] = Array(10).fill(0);
            }
            return board;
        }

        randomPiece() {
            // Define pieces and colors
            const pieces = [
                { shape: [[1, 1, 1, 1]], color: 'cyan' }, // I piece
                { shape: [[1, 1], [1, 1]], color: 'yellow' }, // O piece
                { shape: [[0, 1, 1], [1, 1, 0]], color: 'purple' }, // S piece
                { shape: [[1, 1, 0], [0, 1, 1]], color: 'green' }, // Z piece
                { shape: [[1, 1, 1], [0, 1, 0]], color: 'red' }, // T piece
                { shape: [[1, 1, 0], [1, 1, 1]], color: 'blue' }, // L piece
                { shape: [[0, 1, 1], [1, 1, 1]], color: 'orange' } // J piece
            ];
            return pieces[Math.floor(Math.random() * pieces.length)];
        }

        draw() {
            // Clear the board
            this.ctx.clearRect(0, 0, this.width, this.height);
            // Draw the board and the current piece
            this.drawBoard();
            this.drawPiece(this.currentPiece, 0, 0);
        }

        drawBoard() {
            for (let row = 0; row < this.board.length; row++) {
                for (let col = 0; col < this.board[row].length; col++) {
                    if (this.board[row][col]) {
                        this.ctx.fillStyle = this.board[row][col];
                        this.ctx.fillRect(col * 30, row * 30, 30, 30);
                        this.ctx.strokeRect(col * 30, row * 30, 30, 30);
                    }
                }
            }
        }

        drawPiece(piece, offsetX, offsetY) {
            this.ctx.fillStyle = piece.color;
            piece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        this.ctx.fillRect((offsetX + x) * 30, (offsetY + y) * 30, 30, 30);
                        this.ctx.strokeRect((offsetX + x) * 30, (offsetY + y) * 30, 30, 30);
                    }
                });
            });
        }

        rotate() {
            // Rotate piece
        }

        moveLeft() {
            // Move piece left
        }

        moveRight() {
            // Move piece right
        }

        moveDown() {
            // Move piece down
        }

        restart() {
            this.init();
            this.score = 0;
            this.updateScore();
            this.gameOver = false;
        }

        updateScore() {
            updateScore(this.score);
        }

        start() {
            // Start game logic
        }
    }
});
