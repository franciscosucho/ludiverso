// Game State
let gameState = {
    currentLevel: 1,
    currentStage: 1, // 1: ecuaciones lineales, 2: elementos químicos, 3: ecuaciones cuadráticas
    score: 0,
    lives: 3,
    totalQuestions: 0,
    correctAnswers: 0,
    currentQuestion: 0,
    questionsPerStage: 3,
    stagesPerLevel: 3, // 3 etapas por nivel
    // Seguimiento de niveles completados
    completedLevels: {
        1: false,
        2: false,
        3: false
    }
};

// Tabla periódica completa (array reducido para ejemplo, puedes completarlo con los 118 elementos)
const fullPeriodicTable = [
    {symbol:'H',name:'Hidrógeno',number:1,row:1,col:1,type:'nonmetal'},
    {symbol:'He',name:'Helio',number:2,row:1,col:18,type:'noble-gas'},
    {symbol:'Li',name:'Litio',number:3,row:2,col:1,type:'alkali-metal'},
    {symbol:'Be',name:'Berilio',number:4,row:2,col:2,type:'alkaline-earth-metal'},
    {symbol:'B',name:'Boro',number:5,row:2,col:13,type:'metalloid'},
    {symbol:'C',name:'Carbono',number:6,row:2,col:14,type:'nonmetal'},
    {symbol:'N',name:'Nitrógeno',number:7,row:2,col:15,type:'nonmetal'},
    {symbol:'O',name:'Oxígeno',number:8,row:2,col:16,type:'nonmetal'},
    {symbol:'F',name:'Flúor',number:9,row:2,col:17,type:'halogen'},
    {symbol:'Ne',name:'Neón',number:10,row:2,col:18,type:'noble-gas'},
    {symbol:'Na',name:'Sodio',number:11,row:3,col:1,type:'alkali-metal'},
    {symbol:'Mg',name:'Magnesio',number:12,row:3,col:2,type:'alkaline-earth-metal'},
    {symbol:'Al',name:'Aluminio',number:13,row:3,col:13,type:'post-transition-metal'},
    {symbol:'Si',name:'Silicio',number:14,row:3,col:14,type:'metalloid'},
    {symbol:'P',name:'Fósforo',number:15,row:3,col:15,type:'nonmetal'},
    {symbol:'S',name:'Azufre',number:16,row:3,col:16,type:'nonmetal'},
    {symbol:'Cl',name:'Cloro',number:17,row:3,col:17,type:'halogen'},
    {symbol:'Ar',name:'Argón',number:18,row:3,col:18,type:'noble-gas'},
    {symbol:'K',name:'Potasio',number:19,row:4,col:1,type:'alkali-metal'},
    {symbol:'Ca',name:'Calcio',number:20,row:4,col:2,type:'alkaline-earth-metal'},
    {symbol:'Sc',name:'Escandio',number:21,row:4,col:3,type:'transition-metal'},
    {symbol:'Ti',name:'Titanio',number:22,row:4,col:4,type:'transition-metal'},
    {symbol:'V',name:'Vanadio',number:23,row:4,col:5,type:'transition-metal'},
    {symbol:'Cr',name:'Cromo',number:24,row:4,col:6,type:'transition-metal'},
    {symbol:'Mn',name:'Manganeso',number:25,row:4,col:7,type:'transition-metal'},
    {symbol:'Fe',name:'Hierro',number:26,row:4,col:8,type:'transition-metal'},
    {symbol:'Co',name:'Cobalto',number:27,row:4,col:9,type:'transition-metal'},
    {symbol:'Ni',name:'Níquel',number:28,row:4,col:10,type:'transition-metal'},
    {symbol:'Cu',name:'Cobre',number:29,row:4,col:11,type:'transition-metal'},
    {symbol:'Zn',name:'Zinc',number:30,row:4,col:12,type:'post-transition-metal'},
    {symbol:'Ga',name:'Galio',number:31,row:4,col:13,type:'post-transition-metal'},
    {symbol:'Ge',name:'Germanio',number:32,row:4,col:14,type:'metalloid'},
    {symbol:'As',name:'Arsénico',number:33,row:4,col:15,type:'metalloid'},
    {symbol:'Se',name:'Selenio',number:34,row:4,col:16,type:'nonmetal'},
    {symbol:'Br',name:'Bromo',number:35,row:4,col:17,type:'halogen'},
    {symbol:'Kr',name:'Kriptón',number:36,row:4,col:18,type:'noble-gas'},
    {symbol:'Rb',name:'Rubidio',number:37,row:5,col:1,type:'alkali-metal'},
    {symbol:'Sr',name:'Estroncio',number:38,row:5,col:2,type:'alkaline-earth-metal'},
    {symbol:'Y',name:'Itrio',number:39,row:5,col:3,type:'transition-metal'},
    {symbol:'Zr',name:'Circonio',number:40,row:5,col:4,type:'transition-metal'},
    {symbol:'Nb',name:'Niobio',number:41,row:5,col:5,type:'transition-metal'},
    {symbol:'Mo',name:'Molibdeno',number:42,row:5,col:6,type:'transition-metal'},
    {symbol:'Tc',name:'Tecnecio',number:43,row:5,col:7,type:'transition-metal'},
    {symbol:'Ru',name:'Rutenio',number:44,row:5,col:8,type:'transition-metal'},
    {symbol:'Rh',name:'Rodio',number:45,row:5,col:9,type:'transition-metal'},
    {symbol:'Pd',name:'Paladio',number:46,row:5,col:10,type:'transition-metal'},
    {symbol:'Ag',name:'Plata',number:47,row:5,col:11,type:'transition-metal'},
    {symbol:'Cd',name:'Cadmio',number:48,row:5,col:12,type:'post-transition-metal'},
    {symbol:'In',name:'Indio',number:49,row:5,col:13,type:'post-transition-metal'},
    {symbol:'Sn',name:'Estaño',number:50,row:5,col:14,type:'post-transition-metal'},
    {symbol:'Sb',name:'Antimonio',number:51,row:5,col:15,type:'metalloid'},
    {symbol:'Te',name:'Telurio',number:52,row:5,col:16,type:'metalloid'},
    {symbol:'I',name:'Yodo',number:53,row:5,col:17,type:'halogen'},
    {symbol:'Xe',name:'Xenón',number:54,row:5,col:18,type:'noble-gas'},
    {symbol:'Cs',name:'Cesio',number:55,row:6,col:1,type:'alkali-metal'},
    {symbol:'Ba',name:'Bario',number:56,row:6,col:2,type:'alkaline-earth-metal'},
    {symbol:'La',name:'Lantano',number:57,row:8,col:4,type:'lanthanide'},
    {symbol:'Hf',name:'Hafnio',number:72,row:6,col:4,type:'transition-metal'},
    {symbol:'Ta',name:'Tantalio',number:73,row:6,col:5,type:'transition-metal'},
    {symbol:'W',name:'Tungsteno',number:74,row:6,col:6,type:'transition-metal'},
    {symbol:'Re',name:'Renio',number:75,row:6,col:7,type:'transition-metal'},
    {symbol:'Os',name:'Osmio',number:76,row:6,col:8,type:'transition-metal'},
    {symbol:'Ir',name:'Iridio',number:77,row:6,col:9,type:'transition-metal'},
    {symbol:'Pt',name:'Platino',number:78,row:6,col:10,type:'transition-metal'},
    {symbol:'Au',name:'Oro',number:79,row:6,col:11,type:'transition-metal'},
    {symbol:'Hg',name:'Mercurio',number:80,row:6,col:12,type:'post-transition-metal'},
    {symbol:'Tl',name:'Talio',number:81,row:6,col:13,type:'post-transition-metal'},
    {symbol:'Pb',name:'Plomo',number:82,row:6,col:14,type:'post-transition-metal'},
    {symbol:'Bi',name:'Bismuto',number:83,row:6,col:15,type:'post-transition-metal'},
    {symbol:'Po',name:'Polonio',number:84,row:6,col:16,type:'post-transition-metal'},
    {symbol:'At',name:'Astato',number:85,row:6,col:17,type:'halogen'},
    {symbol:'Rn',name:'Radón',number:86,row:6,col:18,type:'noble-gas'},
    {symbol:'Fr',name:'Francio',number:87,row:7,col:1,type:'alkali-metal'},
    {symbol:'Ra',name:'Radio',number:88,row:7,col:2,type:'alkaline-earth-metal'},
    {symbol:'Ac',name:'Actinio',number:89,row:9,col:4,type:'actinide'},
    {symbol:'Rf',name:'Rutherfordio',number:104,row:7,col:4,type:'transition-metal'},
    {symbol:'Db',name:'Dubnio',number:105,row:7,col:5,type:'transition-metal'},
    {symbol:'Sg',name:'Seaborgio',number:106,row:7,col:6,type:'transition-metal'},
    {symbol:'Bh',name:'Bohrio',number:107,row:7,col:7,type:'transition-metal'},
    {symbol:'Hs',name:'Hassio',number:108,row:7,col:8,type:'transition-metal'},
    {symbol:'Mt',name:'Meitnerio',number:109,row:7,col:9,type:'unknown'},
    {symbol:'Ds',name:'Darmstadtio',number:110,row:7,col:10,type:'unknown'},
    {symbol:'Rg',name:'Roentgenio',number:111,row:7,col:11,type:'unknown'},
    {symbol:'Cn',name:'Copernicio',number:112,row:7,col:12,type:'post-transition-metal'},
    {symbol:'Fl',name:'Flerovio',number:114,row:7,col:14,type:'post-transition-metal'},
    {symbol:'Lv',name:'Livermorio',number:116,row:7,col:16,type:'post-transition-metal'},
    {symbol:'Ts',name:'Teneso',number:117,row:7,col:17,type:'halogen'},
    {symbol:'Og',name:'Oganesón',number:118,row:7,col:18,type:'noble-gas'},
    // Lantánidos (fila 8)
    {symbol:'Ce',name:'Cerio',number:58,row:8,col:5,type:'lanthanide'},
    {symbol:'Pr',name:'Praseodimio',number:59,row:8,col:6,type:'lanthanide'},
    {symbol:'Nd',name:'Neodimio',number:60,row:8,col:7,type:'lanthanide'},
    {symbol:'Pm',name:'Prometio',number:61,row:8,col:8,type:'lanthanide'},

    // Algunos elementos superpesados
    {symbol:'Nh',name:'Nihonio',number:113,row:7,col:13,type:'post-transition-metal'},
    {symbol:'Mc',name:'Moscovio',number:115,row:7,col:15,type:'post-transition-metal'},
];

// Game Data - Organizado por nivel de dificultad
const gameData = {
    // NIVEL 1 - FÁCIL (Elementos más comunes y conocidos)
    level1: {
        linearEquations: [
            { equation: "x + 2 = 5", answer: 3 },
            { equation: "x - 3 = 4", answer: 7 },
            { equation: "2x = 8", answer: 4 },
            { equation: "3x = 12", answer: 4 },
            { equation: "x + 5 = 10", answer: 5 },
            { equation: "x - 2 = 6", answer: 8 },
            { equation: "4x = 16", answer: 4 },
            { equation: "x + 1 = 9", answer: 8 },
            { equation: "5x = 20", answer: 4 },
            { equation: "x - 4 = 3", answer: 7 }
        ],
        elements: [
            { symbol: 'H', name: 'Hidrógeno', number: 1, row: 1, col: 1, type: 'nonmetal' },
            { symbol: 'He', name: 'Helio', number: 2, row: 1, col: 18, type: 'noble-gas' },
            { symbol: 'C', name: 'Carbono', number: 6, row: 2, col: 14, type: 'nonmetal' },
            { symbol: 'N', name: 'Nitrógeno', number: 7, row: 2, col: 15, type: 'nonmetal' },
            { symbol: 'O', name: 'Oxígeno', number: 8, row: 2, col: 16, type: 'nonmetal' },
            { symbol: 'Na', name: 'Sodio', number: 11, row: 3, col: 1, type: 'metal' },
            { symbol: 'Mg', name: 'Magnesio', number: 12, row: 3, col: 2, type: 'metal' },
            { symbol: 'Al', name: 'Aluminio', number: 13, row: 3, col: 13, type: 'metal' },
            { symbol: 'Si', name: 'Silicio', number: 14, row: 3, col: 14, type: 'metalloid' },
            { symbol: 'Cl', name: 'Cloro', number: 17, row: 3, col: 17, type: 'nonmetal' },
            { symbol: 'K', name: 'Potasio', number: 19, row: 4, col: 1, type: 'metal' },
            { symbol: 'Ca', name: 'Calcio', number: 20, row: 4, col: 2, type: 'metal' },
            { symbol: 'Fe', name: 'Hierro', number: 26, row: 4, col: 8, type: 'metal' },
            { symbol: 'Cu', name: 'Cobre', number: 29, row: 4, col: 11, type: 'metal' },
            { symbol: 'Zn', name: 'Zinc', number: 30, row: 4, col: 12, type: 'metal' }
        ],
        quadraticEquations: [
            { 
                equation: "x² - 4 = 0", 
                correctAnswer: 2, 
                options: [1, 2, 3] 
            },
            { 
                equation: "x² - 9 = 0", 
                correctAnswer: 3, 
                options: [2, 3, 4] 
            },
            { 
                equation: "x² - 1 = 0", 
                correctAnswer: 1, 
                options: [1, 2, 0] 
            },
            { 
                equation: "x² - 16 = 0", 
                correctAnswer: 4, 
                options: [3, 4, 5] 
            },
            { 
                equation: "x² - 25 = 0", 
                correctAnswer: 5, 
                options: [4, 5, 6] 
            }
        ]
    },
    
    // NIVEL 2 - MEDIO (Elementos importantes pero menos conocidos)
    level2: {
        linearEquations: [
            { equation: "2x + 4 = 12", answer: 4 },
            { equation: "3x - 6 = 9", answer: 5 },
            { equation: "5x + 10 = 25", answer: 3 },
            { equation: "4x - 8 = 16", answer: 6 },
            { equation: "6x + 12 = 30", answer: 3 },
            { equation: "7x - 14 = 21", answer: 5 },
            { equation: "8x + 16 = 32", answer: 2 },
            { equation: "2x + 6 = 18", answer: 6 },
            { equation: "3x - 9 = 12", answer: 7 },
            { equation: "4x + 8 = 28", answer: 5 }
        ],
        elements: [
            { symbol: 'Li', name: 'Litio', number: 3, row: 2, col: 1, type: 'metal' },
            { symbol: 'Be', name: 'Berilio', number: 4, row: 2, col: 2, type: 'metal' },
            { symbol: 'B', name: 'Boro', number: 5, row: 2, col: 13, type: 'metalloid' },
            { symbol: 'F', name: 'Flúor', number: 9, row: 2, col: 17, type: 'nonmetal' },
            { symbol: 'Ne', name: 'Neón', number: 10, row: 2, col: 18, type: 'noble-gas' },
            { symbol: 'P', name: 'Fósforo', number: 15, row: 3, col: 15, type: 'nonmetal' },
            { symbol: 'S', name: 'Azufre', number: 16, row: 3, col: 16, type: 'nonmetal' },
            { symbol: 'Ar', name: 'Argón', number: 18, row: 3, col: 18, type: 'noble-gas' },
            { symbol: 'Sc', name: 'Escandio', number: 21, row: 4, col: 3, type: 'metal' },
            { symbol: 'Ti', name: 'Titanio', number: 22, row: 4, col: 4, type: 'metal' },
            { symbol: 'V', name: 'Vanadio', number: 23, row: 4, col: 5, type: 'metal' },
            { symbol: 'Cr', name: 'Cromo', number: 24, row: 4, col: 6, type: 'metal' },
            { symbol: 'Mn', name: 'Manganeso', number: 25, row: 4, col: 7, type: 'metal' },
            { symbol: 'Ni', name: 'Níquel', number: 28, row: 4, col: 10, type: 'metal' },
            { symbol: 'Br', name: 'Bromo', number: 35, row: 4, col: 17, type: 'nonmetal' },
            { symbol: 'Kr', name: 'Kriptón', number: 36, row: 4, col: 18, type: 'noble-gas' }
        ],
        quadraticEquations: [
            { 
                equation: "x² - 5x + 6 = 0", 
                correctAnswer: 2, 
                options: [2, 3, 4] 
            },
            { 
                equation: "x² - 7x + 12 = 0", 
                correctAnswer: 3, 
                options: [2, 3, 5] 
            },
            { 
                equation: "x² - 6x + 8 = 0", 
                correctAnswer: 2, 
                options: [1, 2, 3] 
            },
            { 
                equation: "x² - 8x + 15 = 0", 
                correctAnswer: 3, 
                options: [3, 4, 5] 
            },
            { 
                equation: "x² - 9x + 18 = 0", 
                correctAnswer: 3, 
                options: [2, 3, 6] 
            }
        ]
    },
    
    // NIVEL 3 - DIFÍCIL (Elementos menos comunes y metales de transición)
    level3: {
        linearEquations: [
            { equation: "3x + 7 = 2x + 15", answer: 8 },
            { equation: "5x - 3 = 3x + 11", answer: 7 },
            { equation: "4x + 9 = 6x - 5", answer: 7 },
            { equation: "7x - 12 = 4x + 9", answer: 7 },
            { equation: "2x + 15 = 5x - 6", answer: 7 },
            { equation: "6x - 8 = 2x + 12", answer: 5 },
            { equation: "8x + 4 = 3x + 24", answer: 4 },
            { equation: "9x - 15 = 6x + 12", answer: 9 },
            { equation: "4x + 13 = 7x - 8", answer: 7 },
            { equation: "5x - 18 = 2x + 9", answer: 9 }
        ],
        elements: [
            { symbol: 'Co', name: 'Cobalto', number: 27, row: 4, col: 9, type: 'metal' },
            { symbol: 'Ga', name: 'Galio', number: 31, row: 4, col: 13, type: 'metal' },
            { symbol: 'Ge', name: 'Germanio', number: 32, row: 4, col: 14, type: 'metalloid' },
            { symbol: 'As', name: 'Arsénico', number: 33, row: 4, col: 15, type: 'metalloid' },
            { symbol: 'Se', name: 'Selenio', number: 34, row: 4, col: 16, type: 'nonmetal' },
            { symbol: 'Rb', name: 'Rubidio', number: 37, row: 5, col: 1, type: 'metal' },
            { symbol: 'Sr', name: 'Estroncio', number: 38, row: 5, col: 2, type: 'metal' },
            { symbol: 'Y', name: 'Itrio', number: 39, row: 5, col: 3, type: 'metal' },
            { symbol: 'Zr', name: 'Circonio', number: 40, row: 5, col: 4, type: 'metal' },
            { symbol: 'Nb', name: 'Niobio', number: 41, row: 5, col: 5, type: 'metal' },
            { symbol: 'Mo', name: 'Molibdeno', number: 42, row: 5, col: 6, type: 'metal' },
            { symbol: 'Tc', name: 'Tecnecio', number: 43, row: 5, col: 7, type: 'metal' },
            { symbol: 'Ru', name: 'Rutenio', number: 44, row: 5, col: 8, type: 'metal' },
            { symbol: 'Rh', name: 'Rodio', number: 45, row: 5, col: 9, type: 'metal' },
            { symbol: 'Pd', name: 'Paladio', number: 46, row: 5, col: 10, type: 'metal' },
            { symbol: 'Ag', name: 'Plata', number: 47, row: 5, col: 11, type: 'metal' },
            { symbol: 'Cd', name: 'Cadmio', number: 48, row: 5, col: 12, type: 'metal' },
            { symbol: 'In', name: 'Indio', number: 49, row: 5, col: 13, type: 'metal' },
            { symbol: 'Sn', name: 'Estaño', number: 50, row: 5, col: 14, type: 'metal' },
            { symbol: 'Sb', name: 'Antimonio', number: 51, row: 5, col: 15, type: 'metalloid' },
            { symbol: 'Te', name: 'Teluro', number: 52, row: 5, col: 16, type: 'metalloid' },
            { symbol: 'I', name: 'Yodo', number: 53, row: 5, col: 17, type: 'nonmetal' },
            { symbol: 'Xe', name: 'Xenón', number: 54, row: 5, col: 18, type: 'noble-gas' },
            { symbol: 'Cs', name: 'Cesio', number: 55, row: 6, col: 1, type: 'metal' },
            { symbol: 'Ba', name: 'Bario', number: 56, row: 6, col: 2, type: 'metal' },
            { symbol: 'La', name: 'Lantano', number: 57, row: 6, col: 3, type: 'metal' },
            { symbol: 'Hf', name: 'Hafnio', number: 72, row: 6, col: 4, type: 'metal' },
            { symbol: 'Ta', name: 'Tantalio', number: 73, row: 6, col: 5, type: 'metal' },
            { symbol: 'W', name: 'Tungsteno', number: 74, row: 6, col: 6, type: 'metal' },
            { symbol: 'Re', name: 'Renio', number: 75, row: 6, col: 7, type: 'metal' },
            { symbol: 'Os', name: 'Osmio', number: 76, row: 6, col: 8, type: 'metal' },
            { symbol: 'Ir', name: 'Iridio', number: 77, row: 6, col: 9, type: 'metal' },
            { symbol: 'Pt', name: 'Platino', number: 78, row: 6, col: 10, type: 'metal' },
            { symbol: 'Au', name: 'Oro', number: 79, row: 6, col: 11, type: 'metal' },
            { symbol: 'Hg', name: 'Mercurio', number: 80, row: 6, col: 12, type: 'metal' },
            { symbol: 'Tl', name: 'Talio', number: 81, row: 6, col: 13, type: 'metal' },
            { symbol: 'Pb', name: 'Plomo', number: 82, row: 6, col: 14, type: 'metal' },
            { symbol: 'Bi', name: 'Bismuto', number: 83, row: 6, col: 15, type: 'metal' },
            { symbol: 'Po', name: 'Polonio', number: 84, row: 6, col: 16, type: 'metalloid' },
            { symbol: 'At', name: 'Astato', number: 85, row: 6, col: 17, type: 'metalloid' },
            { symbol: 'Rn', name: 'Radón', number: 86, row: 6, col: 18, type: 'noble-gas' },
            { symbol: 'Fr', name: 'Francio', number: 87, row: 7, col: 1, type: 'metal' },
            { symbol: 'Ra', name: 'Radio', number: 88, row: 7, col: 2, type: 'metal' },
            { symbol: 'Ac', name: 'Actinio', number: 89, row: 7, col: 3, type: 'metal' },
            { symbol: 'Rf', name: 'Rutherfordio', number: 104, row: 7, col: 4, type: 'metal' },
            { symbol: 'Db', name: 'Dubnio', number: 105, row: 7, col: 5, type: 'metal' },
            { symbol: 'Sg', name: 'Seaborgio', number: 106, row: 7, col: 6, type: 'metal' },
            { symbol: 'Bh', name: 'Bohrio', number: 107, row: 7, col: 7, type: 'metal' },
            { symbol: 'Hs', name: 'Hassio', number: 108, row: 7, col: 8, type: 'metal' },
            { symbol: 'Mt', name: 'Meitnerio', number: 109, row: 7, col: 9, type: 'metal' },
            { symbol: 'Ds', name: 'Darmstadtio', number: 110, row: 7, col: 10, type: 'metal' },
            { symbol: 'Rg', name: 'Roentgenio', number: 111, row: 7, col: 11, type: 'metal' },
            { symbol: 'Cn', name: 'Copernicio', number: 112, row: 7, col: 12, type: 'metal' },
            { symbol: 'Nh', name: 'Nihonio', number: 113, row: 7, col: 13, type: 'metal' },
            { symbol: 'Fl', name: 'Flerovio', number: 114, row: 7, col: 14, type: 'metal' },
            { symbol: 'Mc', name: 'Moscovio', number: 115, row: 7, col: 15, type: 'metal' },
            { symbol: 'Lv', name: 'Livermorio', number: 116, row: 7, col: 16, type: 'metal' },
            { symbol: 'Ts', name: 'Teneso', number: 117, row: 7, col: 17, type: 'metalloid' },
            { symbol: 'Og', name: 'Oganesón', number: 118, row: 7, col: 18, type: 'noble-gas' },
            // Lantánidos
            { symbol: 'Ce', name: 'Cerio', number: 58, row: 8, col: 4, type: 'metal' },
            { symbol: 'Pr', name: 'Praseodimio', number: 59, row: 8, col: 5, type: 'metal' },
            { symbol: 'Nd', name: 'Neodimio', number: 60, row: 8, col: 6, type: 'metal' },
            { symbol: 'Pm', name: 'Prometio', number: 61, row: 8, col: 7, type: 'metal' },
            { symbol: 'Sm', name: 'Samario', number: 62, row: 8, col: 8, type: 'metal' },
            { symbol: 'Eu', name: 'Europio', number: 63, row: 8, col: 9, type: 'metal' },
            { symbol: 'Gd', name: 'Gadolinio', number: 64, row: 8, col: 10, type: 'metal' },
            { symbol: 'Tb', name: 'Terbio', number: 65, row: 8, col: 11, type: 'metal' },
            { symbol: 'Dy', name: 'Disprosio', number: 66, row: 8, col: 12, type: 'metal' },
            { symbol: 'Ho', name: 'Holmio', number: 67, row: 8, col: 13, type: 'metal' },
            { symbol: 'Er', name: 'Erbio', number: 68, row: 8, col: 14, type: 'metal' },
            { symbol: 'Tm', name: 'Tulio', number: 69, row: 8, col: 15, type: 'metal' },
            { symbol: 'Yb', name: 'Iterbio', number: 70, row: 8, col: 16, type: 'metal' },
            { symbol: 'Lu', name: 'Lutecio', number: 71, row: 8, col: 17, type: 'metal' },
            // Actínidos
            { symbol: 'Th', name: 'Torio', number: 90, row: 9, col: 4, type: 'metal' },
            { symbol: 'Pa', name: 'Protactinio', number: 91, row: 9, col: 5, type: 'metal' },
            { symbol: 'U', name: 'Uranio', number: 92, row: 9, col: 6, type: 'metal' },
            { symbol: 'Np', name: 'Neptunio', number: 93, row: 9, col: 7, type: 'metal' },
            { symbol: 'Pu', name: 'Plutonio', number: 94, row: 9, col: 8, type: 'metal' },
            { symbol: 'Am', name: 'Americio', number: 95, row: 9, col: 9, type: 'metal' },
            { symbol: 'Cm', name: 'Curio', number: 96, row: 9, col: 10, type: 'metal' },
            { symbol: 'Bk', name: 'Berkelio', number: 97, row: 9, col: 11, type: 'metal' },
            { symbol: 'Cf', name: 'Californio', number: 98, row: 9, col: 12, type: 'metal' },
            { symbol: 'Es', name: 'Einstenio', number: 99, row: 9, col: 13, type: 'metal' },
            { symbol: 'Fm', name: 'Fermio', number: 100, row: 9, col: 14, type: 'metal' },
            { symbol: 'Md', name: 'Mendelevio', number: 101, row: 9, col: 15, type: 'metal' },
            { symbol: 'No', name: 'Nobelio', number: 102, row: 9, col: 16, type: 'metal' },
            { symbol: 'Lr', name: 'Lawrencio', number: 103, row: 9, col: 17, type: 'metal' }
        ],
        quadraticEquations: [
            { 
                equation: "2x² - 8x + 6 = 0", 
                correctAnswer: 1, 
                options: [1, 2, 3] 
            },
            { 
                equation: "x² + 2x - 8 = 0", 
                correctAnswer: 2, 
                options: [1, 2, 4] 
            },
            { 
                equation: "x² - x - 6 = 0", 
                correctAnswer: 3, 
                options: [2, 3, 4] 
            },
            { 
                equation: "2x² - 6x + 4 = 0", 
                correctAnswer: 1, 
                options: [1, 2, 3] 
            },
            { 
                equation: "x² - 4x + 3 = 0", 
                correctAnswer: 1, 
                options: [1, 2, 3] 
            }
        ]
    }
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    results: document.getElementById('results-screen')
};

const buttons = {
    start: document.getElementById('start-btn'),
    submitAnswer: document.getElementById('submit-answer'),
    submitElement: document.getElementById('submit-element'),
    submitQuadratic: document.getElementById('submit-quadratic'),
    restart: document.getElementById('restart-btn'),
    share: document.getElementById('share-btn'),
    back: document.getElementById('back-btn'),
    skipLevel1: document.getElementById('skip-level1'),
    skipLevel2: document.getElementById('skip-level2'),
    skipLevel3: document.getElementById('skip-level3')
};

const displays = {
    currentLevel: document.getElementById('current-level'),
    score: document.getElementById('score'),
    lives: document.getElementById('lives'),
    progressFill: document.getElementById('progress-fill'),
    equation: document.getElementById('equation-display'),
    quadratic: document.getElementById('quadratic-display'),
    feedback: document.getElementById('feedback'),
    elementFeedback: document.getElementById('element-feedback'),
    quadraticFeedback: document.getElementById('quadratic-feedback'),
    finalMessage: document.getElementById('final-message'),
    finalScore: document.getElementById('final-score'),
    finalLevel: document.getElementById('final-level'),
    accuracy: document.getElementById('accuracy')
};

const inputs = {
    answer: document.getElementById('answer-input'),
    element: document.getElementById('element-input'),
    quadratic: document.getElementById('quadratic-input')
};

// Variables globales para el control del juego
let currentQuestions = [];
let currentQuestionIndex = 0;
let missingElement = null;
let currentQuadraticOptions = [];

// Utility Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showLevel(levelNum) {
    document.querySelectorAll('.level-content').forEach(level => level.classList.remove('active'));
    
    // Mostrar la interfaz apropiada según la etapa
    if (gameState.currentStage === 1) {
        document.getElementById(`level-1`).classList.add('active'); // Ecuaciones lineales
    } else if (gameState.currentStage === 2) {
        document.getElementById(`level-2`).classList.add('active'); // Elementos químicos
    } else if (gameState.currentStage === 3) {
        document.getElementById(`level-3`).classList.add('active'); // Ecuaciones cuadráticas
    }
}

function updateDisplay() {
    const stageNames = ['', 'Ecuaciones Lineales', 'Elementos Químicos', 'Ecuaciones Cuadráticas'];
    displays.currentLevel.textContent = `Nivel ${gameState.currentLevel} - ${stageNames[gameState.currentStage]}`;
    displays.score.textContent = gameState.score;
    displays.lives.textContent = '❤️'.repeat(gameState.lives);
    
    const progress = (gameState.currentQuestion / gameState.questionsPerStage) * 100;
    displays.progressFill.style.width = `${progress}%`;
}

function showFeedback(element, message, isCorrect) {
    element.textContent = message;
    element.className = 'feedback ' + (isCorrect ? 'success' : 'error');
    
    setTimeout(() => {
        element.textContent = '';
        element.className = 'feedback';
    }, 3000);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Función principal para inicializar cada etapa
function initCurrentStage() {
    gameState.currentQuestion = 0;
    currentQuestionIndex = 0;
    
    if (gameState.currentStage === 1) {
        initLinearEquations();
    } else if (gameState.currentStage === 2) {
        initElements();
    } else if (gameState.currentStage === 3) {
        initQuadraticEquations();
    }
    
    showLevel(gameState.currentLevel);
    updateDisplay();
}

// Etapa 1: Ecuaciones Lineales
function initLinearEquations() {
    const levelData = gameData[`level${gameState.currentLevel}`];
    currentQuestions = shuffleArray(levelData.linearEquations).slice(0, gameState.questionsPerStage);
    showLinearQuestion();
}

function showLinearQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        completeStage();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    displays.equation.textContent = question.equation;
    inputs.answer.value = '';
    inputs.answer.focus();
}

function checkLinearAnswer() {
    const userAnswer = parseInt(inputs.answer.value);
    const correctAnswer = currentQuestions[currentQuestionIndex].answer;
    
    gameState.totalQuestions++;
    
    if (userAnswer === correctAnswer) {
        gameState.correctAnswers++;
        gameState.score += 100;
        showFeedback(displays.feedback, '¡Correcto! +100 puntos', true);
        
        setTimeout(() => {
            currentQuestionIndex++;
            gameState.currentQuestion++;
            updateDisplay();
            showLinearQuestion();
        }, 1500);
    } else {
        gameState.lives--;
        showFeedback(displays.feedback, `Incorrecto. La respuesta era x = ${correctAnswer}`, false);
        
        if (gameState.lives <= 0) {
            setTimeout(() => endGame(), 2000);
        } else {
            setTimeout(() => {
                currentQuestionIndex++;
                gameState.currentQuestion++;
                updateDisplay();
                showLinearQuestion();
            }, 2000);
        }
    }
    
    updateDisplay();
}

// Etapa 2: Elementos Químicos
function initElements() {
    gameState.currentQuestion = 0;
    updateDisplay();
    createPeriodicTable();
}

function createPeriodicTable() {
    if (gameState.currentQuestion >= gameState.questionsPerStage) {
        completeStage();
        return;
    }
    
    const table = document.getElementById('periodic-table');
    table.innerHTML = '';

    // Usar la tabla completa para la etapa 2
    let elementsArray = fullPeriodicTable;
    // Elegir el elemento faltante
    missingElement = elementsArray[Math.floor(Math.random() * elementsArray.length)];

    // Crear una tabla completa de 18 columnas x 7 filas
    for (let row = 1; row <= 7; row++) {
        for (let col = 1; col <= 18; col++) {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            // Encontrar el elemento que corresponde a esta posición
            const element = elementsArray.find(
                e => e.row === row && e.col === col
            );
            if (element) {
                elementDiv.className += ` ${element.type}`;
                // Si es el elemento que falta
                if (element.symbol === missingElement?.symbol) {
                    elementDiv.className += ' missing';
                    elementDiv.innerHTML = `
                        <div class="number">${element.number}</div>
                        <div class="symbol">?</div>
                    `;
                } else {
                    elementDiv.innerHTML = `
                        <div class="number">${element.number}</div>
                        <div class="symbol">${element.symbol}</div>
                    `;
                }
                elementDiv.title = element.name;
            }
            table.appendChild(elementDiv);
        }
    }
    inputs.element.value = '';
    inputs.element.focus();
}

function checkElementAnswer() {
    const userAnswer = inputs.element.value.trim();
    const correctAnswer = missingElement.symbol;
    
    gameState.totalQuestions++;
    
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        gameState.correctAnswers++;
        gameState.score += 200;
        showFeedback(displays.elementFeedback, 
            `¡Correcto! Era ${correctAnswer} (${missingElement.name}) +200 puntos`, true);
        
        setTimeout(() => {
            gameState.currentQuestion++;
            updateDisplay();
            createPeriodicTable();
        }, 2000);
    } else {
        gameState.lives--;
        showFeedback(displays.elementFeedback, 
            `Incorrecto. Era ${correctAnswer} (${missingElement.name})`, false);
        
        if (gameState.lives <= 0) {
            setTimeout(() => endGame(), 2000);
        } else {
            setTimeout(() => {
                gameState.currentQuestion++;
                updateDisplay();
                createPeriodicTable();
            }, 2000);
        }
    }
    
    updateDisplay();
}

// Etapa 3: Ecuaciones Cuadráticas (Múltiple Choice)
function initQuadraticEquations() {
    const levelData = gameData[`level${gameState.currentLevel}`];
    currentQuestions = shuffleArray(levelData.quadraticEquations).slice(0, gameState.questionsPerStage);
    showQuadraticQuestion();
}

function showQuadraticQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        completeStage();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    displays.quadratic.textContent = question.equation;

    // Renderizar los botones de opciones en el mismo lugar del input
    const optionsGroup = document.getElementById('quadratic-options-group');
    optionsGroup.innerHTML = '';
    currentQuadraticOptions = shuffleArray(question.options);
    currentQuadraticOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = `x = ${option}`;
        button.className = 'option-btn btn btn-secondary';
        button.style.margin = '0.5rem';
        button.addEventListener('click', () => checkQuadraticAnswer(option));
        optionsGroup.appendChild(button);
    });
}

function createOptionsContainer() {
    const container = document.createElement('div');
    container.id = 'quadratic-options';
    container.className = 'options-container';
    document.getElementById('level-3').appendChild(container);
    return container;
}

function checkQuadraticAnswer(selectedAnswer) {
    const question = currentQuestions[currentQuestionIndex];
    const correctAnswer = question.correctAnswer;
    
    gameState.totalQuestions++;
    
    if (selectedAnswer === correctAnswer) {
        gameState.correctAnswers++;
        gameState.score += 300;
        showFeedback(displays.quadraticFeedback, 
            `¡Correcto! x = ${correctAnswer} +300 puntos`, true);
        
        setTimeout(() => {
            currentQuestionIndex++;
            gameState.currentQuestion++;
            updateDisplay();
            showQuadraticQuestion();
        }, 2000);
    } else {
        gameState.lives--;
        showFeedback(displays.quadraticFeedback, 
            `Incorrecto. La respuesta correcta es x = ${correctAnswer}`, false);
        
        if (gameState.lives <= 0) {
            setTimeout(() => endGame(), 2000);
        } else {
            setTimeout(() => {
                currentQuestionIndex++;
                gameState.currentQuestion++;
                updateDisplay();
                showQuadraticQuestion();
            }, 2000);
        }
    }
    
    updateDisplay();
}

// Game Flow
function startGame() {
    gameState = {
        currentLevel: 1,
        currentStage: 1,
        score: 0,
        lives: 3,
        totalQuestions: 0,
        correctAnswers: 0,
        currentQuestion: 0,
        questionsPerStage: 3,
        stagesPerLevel: 3,
        completedLevels: {
            1: false,
            2: false,
            3: false
        }
    };
    
    showScreen('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initCurrentStage();
}

function completeStage() {
    const stageNames = ['', 'Ecuaciones Lineales', 'Elementos Químicos', 'Ecuaciones Cuadráticas'];
    const stageCompleteMessage = `¡${stageNames[gameState.currentStage]} completada! (3/3 ejercicios)`;
    
    // Mostrar mensaje según la etapa actual
    if (gameState.currentStage === 1) {
        showFeedback(displays.feedback, stageCompleteMessage, true);
    } else if (gameState.currentStage === 2) {
        showFeedback(displays.elementFeedback, stageCompleteMessage, true);
    } else {
        showFeedback(displays.quadraticFeedback, stageCompleteMessage, true);
    }
    
    setTimeout(() => {
        gameState.currentStage++;
        
        if (gameState.currentStage > gameState.stagesPerLevel) {
            // Nivel completado
            gameState.completedLevels[gameState.currentLevel] = true;
            
            if (gameState.currentLevel === 3) {
                endGame(); // Juego completado
            } else {
                gameState.currentLevel++;
                gameState.currentStage = 1;
                initCurrentStage();
            }
        } else {
            // Siguiente etapa del mismo nivel
            initCurrentStage();
        }
    }, 2000);
}

function endGame() {
    const accuracy = gameState.totalQuestions > 0 ? 
        Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
    
    let message = '';
    if (gameState.currentLevel >= 3 && gameState.lives > 0) {
        message = '🎉 ¡Felicitaciones! ¡Has completado todos los niveles!';
    } else if (gameState.currentLevel >= 2) {
        message = '👏 ¡Bien hecho! Has llegado lejos en el desafío.';
    } else {
        message = '💪 ¡Sigue practicando! Cada intento te hace mejorar.';
    }
    
    displays.finalMessage.innerHTML = `<h2>${message}</h2>`;
    displays.finalScore.textContent = gameState.score;
    displays.finalLevel.textContent = gameState.currentLevel;
    displays.accuracy.textContent = `${accuracy}%`;
    
    showScreen('results');
}

function shareResults() {
    const accuracy = gameState.totalQuestions > 0 ? 
        Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
    
    const text = `¡Acabo de completar el Desafío Educativo!\n` +
                `📊 Puntuación: ${gameState.score}\n` +
                `🏆 Nivel alcanzado: ${gameState.currentLevel}\n` +
                `🎯 Precisión: ${accuracy}%\n` +
                `¡Pon a prueba tus conocimientos de matemáticas y química!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Desafío Educativo',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('¡Resultado copiado al portapapeles!');
        });
    }
}

// Event Listeners
buttons.start.addEventListener('click', startGame);
buttons.restart.addEventListener('click', startGame);
buttons.share.addEventListener('click', shareResults);

buttons.submitAnswer.addEventListener('click', checkLinearAnswer);
inputs.answer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkLinearAnswer();
});

buttons.submitElement.addEventListener('click', checkElementAnswer);
inputs.element.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkElementAnswer();
});

buttons.back.addEventListener('click', () => {
    showScreen('start');
});

// Skip exercise functionality
buttons.skipLevel1.addEventListener('click', () => {
    if (gameState.currentStage === 1) {
        gameState.totalQuestions++;
        currentQuestionIndex++;
        gameState.currentQuestion++;
        updateDisplay();
        showLinearQuestion();
    }
});

buttons.skipLevel2.addEventListener('click', () => {
    if (gameState.currentStage === 2) {
        gameState.totalQuestions++;
        gameState.currentQuestion++;
        updateDisplay();
        createPeriodicTable();
    }
});

buttons.skipLevel3.addEventListener('click', () => {
    if (gameState.currentStage === 3) {
        gameState.totalQuestions++;
        currentQuestionIndex++;
        gameState.currentQuestion++;
        updateDisplay();
        showQuadraticQuestion();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showScreen('start');
});
