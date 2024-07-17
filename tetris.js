document.addEventListener('DOMContentLoaded', () => {
    const choices = ['rock', 'paper', 'scissors'];
    const buttons = document.querySelectorAll('#choices button');
    const resultDisplay = document.getElementById('result');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const playerChoice = button.id;
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];

            const result = getResult(playerChoice, computerChoice);
            displayResult(result);
        });
    });

    // Determine game result
    function getResult(player, computer) {
        if (player === computer) {
            return 'Berabere!';
        } else if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'Kazandın!';
        } else {
            return 'Kaybettin!';
        }
    }

    // Display result to user
    function displayResult(result) {
        resultDisplay.textContent = result;
    }
});
