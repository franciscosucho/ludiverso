
let startTime;
let timerInterval;
let moves = 0;
let gameStarted = false;
let selectedPiece = null;
let puzzleData = [];
let solutionShowing = false;
let currentDifficulty = 'easy';
let Imagen_data = document.getElementById('Imagen');
Imagen_data = JSON.parse(Imagen_data.textContent);
let Imagen = `./../Resources/Imagenes/juego_memoria/${Imagen_data}`;

console.log(Imagen)

// Configuraciones de dificultad (removido nivel experto)
const difficultySettings = {
    easy: {
        name: 'Fácil',
        cols: 4,
        rows: 3,
        pieceWidth: 180,
        pieceHeight: 120,
        containerCols: 2,
        emoji: '🟢'
    },
    medium: {
        name: 'Medio',
        cols: 6,
        rows: 4,
        pieceWidth: 120,
        pieceHeight: 90,
        containerCols: 3,
        emoji: '🟡'
    },
    hard: {
        name: 'Difícil',
        cols: 8,
        rows: 6,
        pieceWidth: 90,
        pieceHeight: 60,
        containerCols: 4,
        emoji: '🟠'
    }
};

function selectDifficulty(level) {
    currentDifficulty = level;
    const settings = difficultySettings[level];

    // Actualizar botones
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-level="${level}"]`).classList.add('active');

    // Actualizar info de dificultad
    const totalPieces = settings.cols * settings.rows;
    const descriptions = {
        easy: 'Perfecto para principiantes - Piezas grandes y regiones claramente definidas',
        medium: 'Desafío moderado - Más piezas con detalles geográficos',
        hard: 'Para puzzlers experimentados - Requiere observación detallada'
    };

    document.getElementById('difficultyInfo').innerHTML =
        `${settings.emoji} <strong>Nivel ${settings.name}:</strong> ${totalPieces} piezas - ${descriptions[level]}`;

    // Reiniciar juego si ya estaba iniciado
    if (gameStarted) {
        startGame();
    }
}

function createPuzzleData() {
    const settings = difficultySettings[currentDifficulty];
    const totalPieces = settings.cols * settings.rows;

    puzzleData = [];

    for (let row = 0; row < settings.rows; row++) {
        for (let col = 0; col < settings.cols; col++) {
            const id = row * settings.cols + col + 1;
            const xPos = -col * settings.pieceWidth;
            const yPos = -row * settings.pieceHeight;

            puzzleData.push({
                id: id,
                position: { x: xPos, y: yPos },
                correctPosition: id - 1,
                currentPosition: -1
            });
        }
    }
}

function initializeGame() {
    createPuzzleData();
    createBoard();
    shufflePieces();
    updateProgressDisplay();
}

function createBoard() {
    const settings = difficultySettings[currentDifficulty];
    const board = document.getElementById('puzzleBoard');
    const piecesContainer = document.getElementById('piecesContainer');

    board.innerHTML = '';
    piecesContainer.innerHTML = '';

    // Configurar grid del tablero
    board.style.gridTemplateColumns = `repeat(${settings.cols}, ${settings.pieceWidth}px)`;
    board.style.gridTemplateRows = `repeat(${settings.rows}, ${settings.pieceHeight}px)`;

    // Configurar grid del contenedor de piezas
    piecesContainer.style.gridTemplateColumns = `repeat(${settings.containerCols}, ${settings.pieceWidth}px)`;

    // Crear slots del tablero
    for (let i = 0; i < puzzleData.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-piece empty-slot';
        slot.style.width = settings.pieceWidth + 'px';
        slot.style.height = settings.pieceHeight + 'px';
        slot.dataset.position = i;
        slot.onclick = () => handleSlotClick(i);
        board.appendChild(slot);
    }

    // Crear piezas en el contenedor
    puzzleData.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'puzzle-piece';
        pieceElement.style.width = settings.pieceWidth + 'px';
        pieceElement.style.height = settings.pieceHeight + 'px';
        pieceElement.style.backgroundSize = '720px 360px';
        pieceElement.style.backgroundPosition = `${piece.position.x}px ${piece.position.y}px`;
        pieceElement.dataset.pieceId = piece.id;
        pieceElement.onclick = () => handlePieceClick(piece.id);

        // Efecto de entrada con retraso
        pieceElement.style.opacity = '0';
        pieceElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
            pieceElement.style.transition = 'all 0.3s ease';
            pieceElement.style.opacity = '1';
            pieceElement.style.transform = 'scale(1)';
        }, Math.random() * 1000);

        piecesContainer.appendChild(pieceElement);
    });
}

function shufflePieces() {
    const container = document.getElementById('piecesContainer');
    const pieces = Array.from(container.children);

    // Algoritmo Fisher-Yates para mezclar
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        container.appendChild(pieces[j]);
    }
}

function handlePieceClick(pieceId) {
    const pieceElement = document.querySelector(`[data-piece-id="${pieceId}"]`);

    // Remover selección previa
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // Seleccionar nueva pieza
    if (selectedPiece !== pieceId) {
        selectedPiece = pieceId;
        pieceElement.classList.add('selected');

        // Efecto de sonido visual
        pieceElement.style.animation = 'none';
        setTimeout(() => {
            pieceElement.style.animation = 'correctPulse 0.3s ease-out';
        }, 10);
    } else {
        selectedPiece = null;
    }
}

function handleSlotClick(position) {
    if (selectedPiece === null) return;

    const slot = document.querySelector(`[data-position="${position}"]`);
    const piece = puzzleData.find(p => p.id === selectedPiece);

    if (!piece) return;

    // Verificar si el slot ya está ocupado
    if (!slot.classList.contains('empty-slot')) {
        return;
    }

    // Mover pieza al slot
    movePieceToSlot(selectedPiece, position);
    incrementMoves();

    // Verificar si es la posición correcta
    if (piece.correctPosition === position) {
        slot.classList.add('correct-position');
        createMiniConfetti(slot);
    }

    selectedPiece = null;
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });

    updateProgressDisplay();
    checkWinCondition();
}

function movePieceToSlot(pieceId, position) {
    const settings = difficultySettings[currentDifficulty];
    const piece = puzzleData.find(p => p.id === pieceId);
    const slot = document.querySelector(`[data-position="${position}"]`);
    const pieceElement = document.querySelector(`[data-piece-id="${pieceId}"]`);

    // Actualizar el slot
    slot.className = 'puzzle-piece';
    slot.style.backgroundSize = '720px 360px';
    slot.style.backgroundPosition = `${piece.position.x}px ${piece.position.y}px`;
    slot.dataset.pieceId = pieceId;
    slot.onclick = () => handleBoardPieceClick(pieceId, position);

    // Efecto de transición
    slot.style.transform = 'scale(1.1)';
    setTimeout(() => {
        slot.style.transform = 'scale(1)';
    }, 200);

    // Remover pieza del contenedor
    pieceElement.remove();

    // Actualizar datos
    piece.currentPosition = position;
}

function handleBoardPieceClick(pieceId, position) {
    const settings = difficultySettings[currentDifficulty];
    const piece = puzzleData.find(p => p.id === pieceId);
    const slot = document.querySelector(`[data-position="${position}"]`);
    const piecesContainer = document.getElementById('piecesContainer');

    // Crear nueva pieza en el contenedor
    const pieceElement = document.createElement('div');
    pieceElement.className = 'puzzle-piece';
    pieceElement.style.width = settings.pieceWidth + 'px';
    pieceElement.style.height = settings.pieceHeight + 'px';
    pieceElement.style.backgroundSize = '720px 360px';
    pieceElement.style.backgroundPosition = `${piece.position.x}px ${piece.position.y}px`;
    pieceElement.dataset.pieceId = piece.id;
    pieceElement.onclick = () => handlePieceClick(piece.id);
    piecesContainer.appendChild(pieceElement);

    // Restaurar slot vacío
    slot.className = 'puzzle-piece empty-slot';
    slot.style.backgroundPosition = '';
    slot.classList.remove('correct-position');
    slot.dataset.pieceId = '';
    slot.onclick = () => handleSlotClick(position);

    // Actualizar datos
    piece.currentPosition = -1;
    incrementMoves();
    updateProgressDisplay();
}

function updateProgressDisplay() {
    const correctPlacements = puzzleData.filter(piece =>
        piece.currentPosition === piece.correctPosition
    ).length;

    const progressPercentage = Math.round((correctPlacements / puzzleData.length) * 100);

    document.getElementById('progress').textContent = progressPercentage + '%';
    document.getElementById('progressFill').style.width = progressPercentage + '%';
}

function incrementMoves() {
    moves++;
    document.getElementById('moves').textContent = moves;
}

function startGame() {
    moves = 0;
    gameStarted = true;
    selectedPiece = null;
    solutionShowing = false;

    document.getElementById('moves').textContent = '0';
    document.getElementById('successMessage').classList.add('hidden');

    initializeGame();
    startTimer();
}

function startTimer() {
    startTime = Date.now();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!gameStarted) return;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    document.getElementById('time').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showSolution() {
    if (!gameStarted) {
        alert('¡Primero inicia un nuevo juego!');
        return;
    }

    if (solutionShowing) return;

    solutionShowing = true;
    const slots = document.querySelectorAll('[data-position]');

    // Mostrar solución brevemente
    slots.forEach((slot, index) => {
        const piece = puzzleData.find(p => p.correctPosition === index);
        if (piece && piece.currentPosition !== index) {
            slot.style.backgroundImage = `url(${Imagen})`;
            slot.style.backgroundPosition = `${piece.position.x}px ${piece.position.y}px`;
            slot.style.backgroundSize = '720px 360px';
            slot.style.opacity = '0.6';
            slot.style.border = '3px solid #3498db';
        }
    });

    setTimeout(() => {
        slots.forEach(slot => {
            if (slot.classList.contains('empty-slot')) {
                slot.style.backgroundImage = '';
                slot.style.opacity = '1';
                slot.style.border = '3px dashed #bdc3c7';
            }
        });
        solutionShowing = false;
    }, 3000);
}

function checkWinCondition() {
    const correctPlacements = puzzleData.filter(piece =>
        piece.currentPosition === piece.correctPosition
    ).length;

    if (correctPlacements === puzzleData.length) {
        gameWon();
    }
}

function gameWon() {
    gameStarted = false;
    clearInterval(timerInterval);

    const finalTime = document.getElementById('time').textContent;
    document.getElementById('finalTime').textContent = `⏱️ Tiempo: ${finalTime}`;
    document.getElementById('finalMoves').textContent = `🔄 Movimientos: ${moves}`;
    document.getElementById('completedDifficulty').textContent = difficultySettings[currentDifficulty].name;

    document.getElementById('successMessage').classList.remove('hidden');

    // Efecto de confetti mejorado
    createConfetti();
}

function increaseDifficulty() {
    const levels = ['easy', 'medium', 'hard'];
    const currentIndex = levels.indexOf(currentDifficulty);
    if (currentIndex < levels.length - 1) {
        selectDifficulty(levels[currentIndex + 1]);
        startGame();
    } else {
        alert('¡Ya has alcanzado el nivel más difícil!');
    }
}

function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: ${rect.top + rect.height / 2}px;
            left: ${rect.left + rect.width / 2}px;
            z-index: 1001;
            pointer-events: none;
            border-radius: 50%;
        `;

        document.body.appendChild(confetti);

        // Animación de dispersión
        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let x = 0, y = 0;
        const animate = () => {
            x += vx * 0.02;
            y += vy * 0.02 + 0.5; // gravedad
            confetti.style.transform = `translate(${x}px, ${y}px)`;

            if (y < 200) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        setTimeout(() => animate(), i * 50);
    }
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${8 + Math.random() * 6}px;
                    height: ${8 + Math.random() * 6}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    z-index: 1001;
                    pointer-events: none;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: fall ${3 + Math.random() * 2}s linear forwards;
                `;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

// Inicializar el juego al cargar la página
window.onload = function () {
    initializeGame();

    // Precargar la imagen del mapa
    const img = new Image();
    img.onload = function () {
        console.log('Imagen del mapa cargada correctamente');
        // Forzar actualización de las piezas después de cargar la imagen
        setTimeout(() => {
            const pieces = document.querySelectorAll('.puzzle-piece:not(.empty-slot)');
            pieces.forEach(piece => {
                piece.style.backgroundImage = `url(${Imagen})`;
            });
        }, 100);
    };
    img.onerror = function () {
        console.error('Error al cargar la imagen del mapa');
        alert('Error al cargar la imagen del mapa. Por favor, verifica la conexión a internet.');
    };
    img.src = `${Imagen}`;
};
