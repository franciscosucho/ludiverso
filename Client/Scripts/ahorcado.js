const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
let word = document.getElementById('wordDisplay').getAttribute('data-word');
let hint = document.getElementById('hint').getAttribute('data-hint');
let guessedLetters = new Set();
let wrongGuesses = 0;
const maxWrongGuesses = 7;

// Variables para el ranking
let startTime = Date.now();
let correctGuesses = 0;
let incorrectGuesses = 0;
let currentArea = new URLSearchParams(window.location.search).get('materia');
let totalWordsCompleted = 0;
let gameOver = false;
let usedWords = new Set([word]); // Inicializamos con la palabra actual

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
        correctGuesses++;
        displayWord();
        checkWin();
    } else {
        key.classList.add('wrong');
        wrongGuesses++;
        incorrectGuesses++;
        drawHangman();
        checkLose();
    }
}

// verificar si se ha ganado
function checkWin() {
    const currentWord = document.getElementById('wordDisplay').textContent.replace(/\s/g, '');
    if (currentWord === word) {
        totalWordsCompleted++;
        // Solicitar nueva palabra al servidor
        fetch(`/next-word?area=${currentArea}&completed=${totalWordsCompleted}&usedWords=${Array.from(usedWords).join(',')}`)
            .then(response => response.json())
            .then(data => {
                if (data.completed) {
                    // Si ya completó todas las palabras del área
                    const tiempo = Math.floor((Date.now() - startTime) / 1000);
                    sendScore(tiempo, correctGuesses, incorrectGuesses, true);
                    showGameOver(true);
                    disableKeyboard();
                } else {
                    // Continuar con la siguiente palabra
                    word = data.palabra;
                    hint = data.pista;
                    usedWords.add(word); // Agregar la nueva palabra al conjunto de usadas
                    resetGameState();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// verificar si se ha perdido
function checkLose() {
    if (wrongGuesses >= maxWrongGuesses) {
        const tiempo = Math.floor((Date.now() - startTime) / 1000);
        sendScore(tiempo, correctGuesses, incorrectGuesses, false);
        showGameOver(false);
        disableKeyboard();
        gameOver = true;
    }
}

// resetear el estado del juego para la siguiente palabra
function resetGameState() {
    guessedLetters.clear();
    wrongGuesses = 0;
    document.getElementById('hint').textContent = `Pista: ${hint}`;

    // Resetear el teclado virtual
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('correct', 'wrong');
        key.disabled = false;
    });

    // Limpiar y redibujar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHangman();
    displayWord();
}

// deshabilitar el teclado cuando termina el juego
function disableKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.disabled = true;
    });
    // También removemos el event listener del teclado físico
    document.removeEventListener('keydown', handleKeyPress);
}

// manejador de eventos del teclado físico
function handleKeyPress(event) {
    const key = event.key.toUpperCase();
    if (/^[A-ZÑ]$/.test(key)) {
        guessLetter(key);
    }
}

// enviar puntuación
function sendScore(tiempo, aciertos, intentos_fallidos, victoria) {
    if (gameOver) return; // Evitar envíos múltiples

    fetch('/game-over-ahorcado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tiempo: tiempo,
            aciertos: aciertos,
            intentos_fallidos: intentos_fallidos,
            victoria: victoria,
            palabra_jugada: word,
            id_area: currentArea
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Puntuación registrada:', data);
            if (data.success) {
                // Agregar botón para ver ranking después de 1 segundo
                setTimeout(() => {
                    const gameOver = document.getElementById('gameOver');
                    const rankingButton = document.createElement('button');
                    rankingButton.textContent = 'Ver Ranking';
                    rankingButton.onclick = () => window.location.href = '/ahorcado_ranking?area=' + currentArea;
                    gameOver.appendChild(rankingButton);
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error al registrar puntuación:', error);
        });
}

// mostrar fin del juego
function showGameOver(won) {
    const gameOver = document.getElementById('gameOver');
    const message = document.getElementById('gameOverMessage');
    const correctWord = document.getElementById('correctWord');

    message.textContent = won ? '¡Felicidades! ¡Has ganado!' : '¡Game Over!';
    correctWord.textContent = word;
    gameOver.style.display = 'flex';
}

// inicializar juego
function initGame() {
    document.getElementById('hint').textContent = `Pista: ${hint}`;
    createKeyboard();
    displayWord();
    drawHangman();

    // agregar manejador de eventos de teclado
    document.addEventListener('keydown', handleKeyPress);
}

// iniciar el juego cuando se carga la página
window.onload = initGame; 