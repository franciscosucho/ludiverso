const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
let word = document.getElementById('wordDisplay').getAttribute('data-word');
let hint = document.getElementById('hint').getAttribute('data-hint');
let guessedLetters = new Set();
let wrongGuesses = 0;
const maxWrongGuesses = 6;

// dibujar el ahorcado
function drawHangman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // base
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(250, 250);
    ctx.stroke();

    // vertical
    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(100, 50);
    ctx.stroke();

    // horizontal
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.stroke();

    // cuerda
    if (wrongGuesses >= 1) {
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200, 80);
        ctx.stroke();
    }

    // cabeza
    if (wrongGuesses >= 2) {
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    // cuerpo
    if (wrongGuesses >= 3) {
        ctx.beginPath();
        ctx.moveTo(200, 120);
        ctx.lineTo(200, 180);
        ctx.stroke();
    }

    // brazo izq
    if (wrongGuesses >= 4) {
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(170, 160);
        ctx.stroke();
    }

    // brazo der
    if (wrongGuesses >= 5) {
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(230, 160);
        ctx.stroke();
    }

    // pierna izq
    if (wrongGuesses >= 6) {
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(170, 220);
        ctx.stroke();
    }

    // pierna der
    if (wrongGuesses >= 7) {
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(230, 220);
        ctx.stroke();
    }
}

// mostrar la palabra con guiones
function displayWord() {
    const display = word.split('').map(letter => 
        guessedLetters.has(letter) ? letter : '_'
    ).join(' ');
    document.getElementById('wordDisplay').textContent = display;
}

// crear teclado
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    
    letters.forEach(letter => {
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.setAttribute('data-letter', letter);
        key.onclick = () => guessLetter(letter);
        keyboard.appendChild(key);
    });
}

// adivinar letra
function guessLetter(letter) {
    if (guessedLetters.has(letter)) return;
    
    guessedLetters.add(letter);
    const key = document.querySelector(`.key[data-letter="${letter}"]`);
    
    if (word.includes(letter)) {
        key.classList.add('correct');
        displayWord();
        checkWin();
    } else {
        key.classList.add('wrong');
        wrongGuesses++;
        drawHangman();
        checkLose();
    }
}

// verificar victoria
function checkWin() {
    const isComplete = word.split('').every(letter => guessedLetters.has(letter));
    if (isComplete) {
        showGameOver(true);
    }
}

// verificar derrota
function checkLose() {
    if (wrongGuesses >= maxWrongGuesses) {
        showGameOver(false);
    }
}

// mostrar fin del juego
function showGameOver(won) {
    const gameOver = document.getElementById('gameOver');
    const message = document.getElementById('gameOverMessage');
    const correctWord = document.getElementById('correctWord');
    
    message.textContent = won ? '¡Felicidades! ¡Has ganado!' : '¡Game Over!';
    correctWord.textContent = word;
    gameOver.classList.add('show');
}

// inicializar juego
function initGame() {
    document.getElementById('hint').textContent = `Pista: ${hint}`;
    createKeyboard();
    displayWord();
    drawHangman();
    
    // agregar manejador de eventos de teclado
    document.addEventListener('keydown', (event) => {
        const key = event.key.toUpperCase();
        if (/^[A-ZÑ]$/.test(key)) {
            guessLetter(key);
        }
    });
}

// iniciar el juego cuando se carga la página
window.onload = initGame; 