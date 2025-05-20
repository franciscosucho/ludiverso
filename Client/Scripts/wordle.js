const data_wordle = document.getElementById('data-wordle');
var tiempo_intro = 0
var aciertos = 0
let intervalo;

let resources = [];

if (data_wordle) {
    const raw = data_wordle.textContent.trim();
    if (raw) {
        try {
            resources = JSON.parse(raw);
            console.log("Datos cargados correctamente:", resources);
        } catch (err) {
            console.error('Error al parsear JSON:', err, raw);
        }
    } else {
        console.warn('El contenido del script está vacío');
    }
} else {
    console.warn('No se encontró el elemento con id="data-wordle"');
}

// Inicializo palabra secreta y longitud global (se actualizará al resetear)
let secretObj = resources[Math.floor(Math.random() * resources.length)];
let wordLength = secretObj.palabra.length;
const dictionary = resources.map(item => item.palabra);
const pista = document.getElementById("pista");

const state = {
    secret: secretObj.palabra,
    descrip: secretObj.descrip,
    primer_letra: secretObj.palabra.charAt(0),
    ultima_letra: secretObj.palabra.slice(-1),
    grid: Array(6).fill().map(() => Array(wordLength).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function drawGrid(container) {
    container.innerHTML = ''; // limpio el contenedor antes

    const rows = state.grid.length;
    const cols = state.grid[0].length;

    const grid = document.createElement('div');
    grid.className = 'grid';

    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    grid.style.gap = '16px';

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;
    container.appendChild(box);
    return box;
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            if (box) {
                box.textContent = state.grid[i][j];
            }
        }
    }
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        const cols = state.grid[0].length;

        if (key === 'Enter') {
            if (state.currentCol === cols) {
                const word = getCurrentWord();
                // if (isWordValid(word)) {
                revealWord(word);
                state.currentRow++;
                state.currentCol = 0;
                // } else {
                //     alert('Palabra no válida.');
                // }
            }
        }
        if (key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }

        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr, '');
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
    return [...word].filter(l => l === letter).length;
}

function getPositionOfOccurrence(word, letter, position) {
    let result = 0;
    for (let i = 0; i <= position; i++) {
        if (word[i] === letter) result++;
    }
    return result;
}

function revealWord(guess) {
    const row = state.currentRow;
    const duration = 500;
    const cols = state.grid[0].length;

    for (let i = 0; i < cols; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        const secret = state.secret;

        setTimeout(() => {
            if (letter === secret[i]) {
                box.classList.add('right');  // Verde
            } else if (secret.includes(letter)) {
                box.classList.add('wrong');  // Amarillo
            } else {
                box.classList.add('empty');  // Gris
            }
        }, ((i + 1) * duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * duration) / 2}ms`;
    }

    const isWinner = guess === state.secret;
    const isGameOver = state.currentRow === 5;

    setTimeout(() => {
        if (isWinner) {
            aciertos++;
            clearGrid();
        } else if (isGameOver) {
            alert(`¡Fin del juego! La palabra era: ${state.secret}`);
            clearInterval(intervalo);
            fetch('/game-over-wordle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
    
                    tiempo: tiempo_intro,
                    aciertos: aciertos
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos:', error);
                });
        }
    }, 3 * duration);
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/i);
}

function addLetter(letter) {
    const cols = state.grid[0].length;
    if (state.currentCol === cols) return;
    state.grid[state.currentRow][state.currentCol] = letter.toLowerCase();
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.currentCol--;
    state.grid[state.currentRow][state.currentCol] = '';
}

function resetState() {
    const newSecret = resources[Math.floor(Math.random() * resources.length)];

    state.secret = newSecret.palabra;
    state.descrip = newSecret.descrip;
    state.primer_letra = newSecret.palabra.charAt(0);
    state.ultima_letra = newSecret.palabra.slice(-1);

    // Actualizo la longitud global para sincronizar
    wordLength = newSecret.palabra.length;

    state.grid = Array(6).fill().map(() => Array(wordLength).fill(''));
    state.currentRow = 0;
    state.currentCol = 0;
}

function clearGrid() {
    // Resetear pistas
    document.getElementById("primer_l").textContent = `Primer letra:`;
    document.getElementById("ultima_l").textContent = `Ultima letra:`;

    // Vaciar el grid
    const gameContainer = document.getElementById("game");
    gameContainer.innerHTML = "";

    // Reiniciar el estado
    resetState();

    // Volver a dibujar la grilla con el nuevo tamaño
    drawGrid(gameContainer);


    console.log(state.secret)
    // Actualizar la pista y estadísticas
    pista.textContent = `"${state.descrip}"`;
    document.getElementById("palabras_acer").textContent = `Palabras acertadas: ${aciertos}`;
}

function startup() {
    console.log(state.secret)
    clearInterval(intervalo);
    tiempo_intro = 0;

    intervalo = setInterval(() => {
        tiempo_intro++;
        document.getElementById("tiempo").textContent = `Tiempo: ${tiempo_intro} Segundos`;
    }, 1000);

    document.getElementById("palabras_acer").textContent = `Palabras acertadas: ${aciertos}`

    const game = document.getElementById('game');

    pista.textContent = `Pista: "${state.descrip}"`;
    drawGrid(game);
    registerKeyboardEvents();
}

startup();

document.getElementById("primer_l").addEventListener("click", () => {
    document.getElementById("primer_l").textContent = `Primer letra: ${state.primer_letra}`
})
document.getElementById("ultima_l").addEventListener("click", () => {
    document.getElementById("ultima_l").textContent = `Ultima letra: ${state.ultima_letra}`
})
