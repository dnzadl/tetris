// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    const width = 70; // %30 küçültülmüş boyut
    const height = 120; // %30 küçültülmüş boyut
    canvas.width = width;
    canvas.height = height;

    // Oyun ayarları
    const grid = 30;
    let gameInterval;
    let isGameOver = false;
    let piece = null;
    let score = 0;
    let level = 1;
    let lines = 0;

    // Başlangıç fonksiyonu
    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        isGameOver = false;
        score = 0;
        level = 1;
        lines = 0;
        document.getElementById('score').innerText = 'Score: 0';
        document.getElementById('level').innerText = 'Level: 1';
        document.getElementById('lines').innerText = 'Lines: 0';
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('game-over-message').classList.add('hidden');
        drawBoard();
        gameInterval = setInterval(gameLoop, 1000 / (level * 1.2)); // %20 yavaşlatılmış hız
    }

    // Oyun döngüsü
    function gameLoop() {
        if (isGameOver) {
            clearInterval(gameInterval);
            document.getElementById('game-over-message').innerText = 'Game Over';
            document.getElementById('game-over-message').classList.remove('hidden');
            return;
        }

        // Oyun mantığı ve taş hareketleri burada
    }

    // Tahtayı çizme fonksiyonu
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Tahtayı ve taşları çizme kodları burada
    }

    // Taşı döndürme fonksiyonu
    function rotatePiece() {
        // Taşı döndürme kodu burada
    }

    // Taşı sola hareket ettirme fonksiyonu
    function moveLeft() {
        // Taşı sola hareket ettirme kodu burada
    }

    // Taşı sağa hareket ettirme fonksiyonu
    function moveRight() {
        // Taşı sağa hareket ettirme kodu burada
    }

    // Taşı aşağı hareket ettirme fonksiyonu
    function moveDown() {
        // Taşı aşağı hareket ettirme kodu burada
    }

    // Tuş olayları
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('rotate-button').addEventListener('click', rotatePiece);
    document.getElementById('left-button').addEventListener('click', moveLeft);
    document.getElementById('right-button').addEventListener('click', moveRight);
    document.getElementById('down-button').addEventListener('click', moveDown);

    // Klavye olayları
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
        }
    });
});
