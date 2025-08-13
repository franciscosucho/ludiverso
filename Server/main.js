const express = require('express')
const app = express()

const session = require('express-session')
const mysql = require('mysql2');

const bcrypt = require('bcrypt');
const path = require('path');
const { PORT } = require('./config.js');
const { clave_sesion } = require('./config.js');
const flash = require('connect-flash');

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configuración de multer
const multer = require('multer');
const fs = require('fs');

const upload_nov = multer({ dest: 'uploads/' }); // Carpeta temporal




// // Configuración de express-session
app.use(
    session({
        secret: "Pzdb3Jc%V8pB},p8|$>4r%t'|cs;kzaq8=X",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 30 * 60 * 1000, // 30 minutos en milisegundos 
        },
    })
);
app.use(flash());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

//  permite que los archivos dentro de /Client sean accesibles desde el navegador
app.use(express.static(path.join(__dirname, '../Client')));

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/resources', express.static(path.join(__dirname, '../Client/Resources')));

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ludiverso',
    port: 3306
});

// Encender servidor
app.listen(PORT, () => {
    console.log(`PAGINA: localhost: ${PORT}`)
})


const isLogged = (req, res, next) => {
    if (req.session.user_sesion == '' || typeof req.session.user_sesion == 'undefined') {
        res.redirect('/')
    } else {
        next()
    }
}
const root_verificar = (req, res, next) => {
    if (req.session.root == true) {

        next()
    } else {
        res.redirect('/')
    }
}

const uploadRoute = require('./routes/upload');

app.use('/upload', uploadRoute);



app.get('/', (req, res) => {
    // Mientras este en produccion para ahorrar tiempo
    // res.redirect('/index');

    res.redirect('/login')

})

app.get('/login', (req, res) => {
    res.render('login', { session: req.session });
})

app.get('/index', isLogged, (req, res) => {

    try {
        const select_juegos = 'SELECT j.*, m.nombre AS nombre_materia FROM juegos j JOIN areas m ON j.materia_id = m.materia_id';
        connection.query(select_juegos, [], (err, result_juegos) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor ', err);
                res.status(500).send('Error al ejecutar la query en el servidor');
            } else {

                const select_novedades = 'SELECT * FROM `novedades` WHERE 1 ORDER BY `fecha_novedad` ASC;';
                connection.query(select_novedades, [], (err, result_novedades) => {
                    if (err) {
                        console.error('Error al ejecutar la query en el servidor ', err);
                        res.status(500).send('Error al ejecutar la query en el servidor');
                    } else {

                        res.render('index', { juegos: result_juegos, novedades: result_novedades, sessionUserId: req.session.usuario_id, session: req.session });
                    }
                })
            }
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('index', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

    //
})



/* Toda la logica que tenga el dashboard del admin. 
<--------------------------------------------------------------------------------------------->*/
const dashboardRoutes = require('./routes/dashboard.js');
app.use('', dashboardRoutes);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado de enviar emails. 
<--------------------------------------------------------------------------------------------->*/
const emailRoutes = require('./routes/email.js');
app.use('', emailRoutes);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado del perfil del usuario. 
<--------------------------------------------------------------------------------------------->*/
const profileRoutes = require('./routes/profile.js');
app.use('', profileRoutes);

/* <---------------------------------------------------------------->*/


/* Toda la logica que tenga el apartado del juego wordle 
<--------------------------------------------------------------------------------------------->*/
const wordleRoute = require('./routes/juegos/wordle.js');
app.use('', wordleRoute);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado de registro
<--------------------------------------------------------------------------------------------->*/
const registrarseRoutes = require('./routes/registrarse.js');
app.use('', registrarseRoutes);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado del inicio de sesion
<--------------------------------------------------------------------------------------------->*/
const iniciarSesionRoutes = require('./routes/iniciarSesion.js');
app.use('', iniciarSesionRoutes);

/* <---------------------------------------------------------------->*/


/* Toda la logica que tenga el apartado de puntuar juegos
<--------------------------------------------------------------------------------------------->*/
const puntuarJuegoRoute = require('./routes/puntuarJuego.js');
app.use('', puntuarJuegoRoute);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado de juego ahorcado
<--------------------------------------------------------------------------------------------->*/
const ahorcadoRoute = require('./routes/juegos/ahorcado.js');
app.use('', ahorcadoRoute);

/* <---------------------------------------------------------------->*/


/* Toda la logica que tenga el apartado de juego intro
<--------------------------------------------------------------------------------------------->*/
const juegoMemoryRoute = require('./routes/juegos/memoryCard.js');
app.use('', juegoMemoryRoute);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado de juego intro
<--------------------------------------------------------------------------------------------->*/
const juegoIntroRoute = require('./routes/juegos/juego_intro.js');
app.use('', juegoIntroRoute);

/* <---------------------------------------------------------------->*/


/* Toda la logica que tenga el apartado de juego intro
<--------------------------------------------------------------------------------------------->*/
const juegoExactas = require('./routes/juegos/juegoExactas.js');
app.use('', juegoExactas);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado de juego intro
<--------------------------------------------------------------------------------------------->*/
const rompeCabezas = require('./routes/juegos/rompeCabezas.js');
app.use('', rompeCabezas);

/* <---------------------------------------------------------------->*/


/* Toda la logica que tenga el apartado de juego intro
<--------------------------------------------------------------------------------------------->*/
const areasRoute = require('./routes/areas.js');
app.use('', areasRoute);

/* <---------------------------------------------------------------->*/


/* Toda la logica que tenga el apartado de juego intro
<--------------------------------------------------------------------------------------------->*/
const sobreNosotros = require('./routes/sobreNosotros.js');
app.use('', sobreNosotros);

/* <---------------------------------------------------------------->*/






