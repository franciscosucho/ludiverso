const express = require('express')
const session = require('express-session')
const mysql = require('mysql2');
const app = express()
const bcrypt = require('bcrypt');
const path = require('path');
const { PORT } = require('./config.js');
const { clave_sesion } = require('./config.js');


// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// // Configuración de express-session
app.use(
    session({
        secret: clave_sesion,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 30 * 60 * 1000, // 30 minutos en milisegundos 
        },
    })
);



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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





app.get('/', (req, res) => {
    // Mientras este en produccion para ahorrar tiempo
    res.render('login')
    // try {
    //     const insert_usuario = 'SELECT j.*, m.nombre AS nombre_materia FROM juegos j JOIN areas m ON j.materia_id = m.materia_id';
    //     connection.query(insert_usuario, [], (err, result_juegos) => {
    //         if (err) {
    //             console.error('Error al registrarse ', err);
    //             res.status(500).send('Error al registrarse ');
    //         } else {
    //             res.render('index', { juegos: result_juegos });
    //         }
    //     })
    // }catch (err) {
    //     console.error('Error al abrir la pagina principal:', err);
    //     res.render('index', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    // }
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/index', (req, res) => {
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
                        console.log(result_novedades[0].fecha_novedad)
                        res.render('index', { juegos: result_juegos, novedades: result_novedades });
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

app.get('/register', (req, res) => {
    res.render('register');
})


app.post('/registrar', async (req, res) => {
    try {
        const { nombre_us, apellido_us, nombre_usuario_us, email_us, password_us } = req.body;


        const hash = await hashPassword(password_us);
        const insert_usuario = "INSERT INTO usuarios ( nombre , apellido , nombre_usuario , email , contraseña, rol_id) VALUES (?,?,?,?,?,?)";

        connection.query(insert_usuario, [nombre_us, apellido_us, nombre_usuario_us, email_us, hash, 2], (err, result) => {
            if (err) {
                console.error('Error al registrarse ', err);
                res.status(500).send('Error al registrarse ');
            } else {
                req.session.nombre_us == nombre_us
                req.session.apellido_us == "oscuro"
                req.session.nombre_usuario_us == nombre_usuario_us
                req.session.email_us == email_us
                req.session.password_us == password_us
                req.session.rol_us == 2
                res.redirect('/index');
            }
        })

    } catch (err) {
        console.error('Error en la consulta:', err);
        res.render('register', { error: 'Ocurrio un error al monento de registrase' });
    }


})


app.post('/iniciar_sesion', async (req, res) => {
    try {
        const { user_name, password } = req.body;

        // Si no se envían credenciales,  renderiza la vista sin error
        if (!user_name?.trim() || !password?.trim()) {
            console.log("Los campos están vacíoss");
            console.log(user_name)
            console.log(password)
            return res.render('login.ejs', { error: 'Por favor, completa todos los campos.' });
        }

        const query_ini = 'SELECT * FROM `usuarios` WHERE nombre_usuario =?';
        const [userResults] = await connection.promise().query(query_ini, [user_name]);

        if (userResults.length === 0) {
            return res.render('login.ejs', { error: 'Usuario o contraseña incorrectos' });
        }

        const hashedPassword = userResults[0].contraseña;
        const isMatch = await verifyPassword(password, hashedPassword);
        if (isMatch) {
            req.session.user_sesion = true;
            return res.redirect('/index');
        } else {
            return res.render('login.ejs', { error: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        console.error('Error en inicio de sesión:', err);
        return res.render('login.ejs', { error: 'Error al verificar los datos' });
    }

})


app.get('/areas', (req, res) => {
    const area = req.query.area;
    let area_id 

    if (area == "Sociales") {
        area_id = 6
    }
    if (area == "edu_fisica") {
        area_id = 5
    }
    if (area == "Comunicaciones") {
        area_id = 1
    }
    if (area == "Taller") {
        area_id = 7
    }
    if (area == "exactas_naturales") {
        area_id = 2
    }
    
    const select_areas = 'SELECT * FROM `areas` WHERE materia_id=?'
    connection.query(select_areas, [area_id], (err, result_areas) => {
        if (err) {
            console.error('Error al registrarse ', err);
            res.status(500).send('Error al registrarse ');
        } else {
            const select_juegos = 'SELECT * FROM `juegos` WHERE materia_id=?'
            connection.query(select_juegos, [area_id], (err, result_juegos) => {
                if (err) {
                    console.error('Error al registrarse ', err);
                    res.status(500).send('Error al registrarse ');
                } else {
                    res.render("areas", { data_areas: result_areas, data_juegos:result_juegos})
                }
            })

        }
    })
})

/*<------------------------------------------------------------------------------------------------------>
    Area de funciones.
*/

// Función para comparar una contraseña con su hash
async function verifyPassword(plainPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        throw error;
    }
}
// Funcion para hashear una contraseña
async function hashPassword(plainPassword) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        throw error;
    }
}
// Funcion para solicitar la fecha actual.
function Datatime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}