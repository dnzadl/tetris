<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tetris Oyunu</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #000;
            color: #fff;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        #gameCanvas {
            border: 4px solid #175DA9;
            background-color: #111;
            width: 100%;
            max-width: 375px; /* Max genişlik */
            max-height: calc(100vh - 250px);
        }
        #controls {
            display: flex;
            justify-content: center;
            margin-top: 10px;
            width: 100%;
            max-width: 375px;
        }
        .control-button {
            width: 50px;
            height: 50px;
            margin: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #175DA9;
            border: none;
            color: #fff;
            font-size: 24px;
            border-radius: 5px;
        }
        #scoreboard {
            margin-top: 10px;
            text-align: center;
        }
        #score {
            font-size: 24px;
        }
        #highScores {
            list-style: none;
            padding: 0;
        }
        #highScores li {
            font-size: 20px;
        }
        #gameOverMessage {
            display: none;
            font-size: 24px;
            margin-top: 20px;
        }
        #restartButton {
            display: none;
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #175DA9;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="375" height="667"></canvas>
    <div id="controls">
        <button id="leftButton" class="control-button">⬅️</button>
        <button id="rotateButton" class="control-button">⤴️</button>
        <button id="rightButton" class="control-button">➡️</button>
    </div>
    <div id="downButton" class="control-button">⬇️</div>
    <div id="scoreboard">
        <div>Score: <span id="score">0</span></div>
        <ul id="highScores"></ul>
        <div id="gameOverMessage"></div>
        <button id="restartButton">Yeniden Başlat</button>
    </div>
    <audio id="blockBreakSound" src="block-break.mp3"></audio>
    <audio id="winSound" src="win.mp3"></audio>
    <audio id="loseSound" src="lose.mp3"></audio>
    <script src="tetris.js"></script>
</body>
</html>
