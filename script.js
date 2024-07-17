// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    const width = 120; // %30 küçültülmüş boyut
    const height = 210; // %30 küçültülmüş boyut
    canvas.width = width;
    canvas.height = height;

    // Oyun ayarları
    const grid = 30;
    let gameInterval;
    let isGameOver = false;

    // Taşlar, skor ve oyun durumu
    const pieces = [/* Tetris taşları tanımlamaları */];
    let piece;
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
        drawBoard();
        gameInterval = setInterval(gameLoop, 1000 / level);
    }

    // Oyun döngüsü
    function gameLoop() {
        if (isGameOver) {
            clearInterval(gameInterval);
            document.getElementById('game-over-message').innerText = 'Game Over';
            return;
        }

        // Oyun mantığı ve taş hareketleri burada
    }

    // Tahtayı çizme fonksiyonu
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Tahtayı ve taşları çizme kodları burada
    }

    // Tuş olayları
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('rotate-button').addEventListener('click', () => {
        // Taşı döndürme kodu burada
    });
    document.getElementById('left-button').addEventListener('click', () => {
        // Taşı sola hareket ettirme kodu burada
    });
    document.getElementById('right-button').addEventListener('click', () => {
        // Taşı sağa hareket ettirme kodu burada
    });
    document.getElementById('down-button').addEventListener('click', () => {
        // Taşı aşağı hareket ettirme kodu burada
    });

    // Klavye olayları
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                // Taşı sola hareket ettirme kodu burada
                break;
            case 'ArrowRight':
                // Taşı sağa hareket ettirme kodu burada
                break;
            case 'ArrowDown':
                // Taşı aşağı hareket ettirme kodu burada
                break;
            case 'ArrowUp':
                // Taşı döndürme kodu burada
                break;
        }
    });
});
