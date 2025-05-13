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
        secret: "Pzdb3Jc%V8pB},p8|$>4r%t'|cs;kzaq8=X",
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
const root_verificar = (req, res, next) => {
    if (req.session.root == true) {

        next()
    } else {
        res.redirect('/')
    }
}




app.get('/', (req, res) => {
    // Mientras este en produccion para ahorrar tiempo
    // res.redirect('/index');



    res.redirect('/login')
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

                        res.render('index', { juegos: result_juegos, novedades: result_novedades, sessionUserId: req.session.usuario_id });
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

        connection.query(insert_usuario, [nombre_us, apellido_us, nombre_usuario_us, email_us, hash, "alumno"], (err, result) => {
            if (err) {
                console.error('Error al registrarse ', err);
                res.status(500).send('Error al registrarse ');
            } else {
                const info_us = "SELECT `usuario_id` FROM `usuarios` WHERE 1 ORDER BY `usuario_id` DESC";
                connection.query(info_us, [], (err, result_id) => {
                    if (err) {
                        console.error('Error al registrarse ', err);
                        res.status(500).send('Error al registrarse ');
                    } else {
                        console.log("id:", result_id)

                        req.session.usuario_id = result_id[0].usuario_id + 1;
                        req.session.nombre_us = nombre_us
                        req.session.apellido_us = apellido_us
                        req.session.nombre_usuario_us = nombre_usuario_us
                        req.session.email_us = email_us
                        req.session.password_us = password_us
                        req.session.rol_us = "alumno"
                        req.session.user_sesion = true;
                        res.redirect('/index');
                    }
                })

            }
        })

    } catch (err) {
        console.error('Error en la consulta:', err);
        res.render('register', { error: 'Ocurrio un error al monento de registrase' });
    }


})
app.get('/dashboard', root_verificar, async (req, res) => {
    try {
        const select_users = 'SELECT * FROM `usuarios` WHERE nombre_usuario !="fransucho"';
        connection.query(select_users, [], (err, result_users) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor ', err);
                res.status(500).send('Error al ejecutar la query en el servidor');
            } else {
                console.log(req.session.nombre_us)
                res.render('dashboard', { users_res: result_users, user_session_nombre: req.session.nombre_us });

            }
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dashboard', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
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
            req.session.usuario_id = userResults[0].usuario_id;
            req.session.nombre_us = userResults[0].nombre;
            req.session.apellido_us = userResults[0].apellido;
            req.session.nombre_usuario_us = userResults[0].nombre_usuario;
            req.session.email_us = userResults[0].email;
            req.session.password_us = userResults[0].contraseña;
            req.session.rol_us = userResults[0].rol;
            req.session.user_sesion = true;
            if (req.session.rol_us == "root") {
                req.session.root = true;
                return res.redirect('/dashboard');

            } else {
                req.session.root = false;
                return res.redirect('/index');
            }

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
                    res.render("areas", { data_areas: result_areas, data_juegos: result_juegos })
                }
            })

        }
    })
})

app.get('/juego_memoria', (req, res) => {


    let id_juego = req.query.id_nivel;
    const select_areas = 'SELECT * FROM `niveles_memory` WHERE id_nivel=?'
    connection.query(select_areas, [id_juego], (err, result_juego) => {
        if (err) {
            console.error('Error al registrarse ', err);
            res.status(500).send('Error al registrarse ');
        } else {
            let id_nivel = result_juego[0].id_nivel;
            let id_area = result_juego[0].id_area;
            const select_juegos = 'SELECT * FROM `resources_juego` WHERE id_nivel=?'
            connection.query(select_juegos, [id_nivel], (err, result_resources) => {
                if (err) {
                    console.error('Error al registrarse ', err);
                    res.status(500).send('Error al registrarse ');
                } else {
                    res.render("juego_memoria", { data_juego: result_juego, data_resources: result_resources, id_area: id_area, id_nivel: id_nivel })
                }
            })

        }
    })

})

app.get('/juego_intro', (req, res) => {
    let areas = ["Taller", "Comunicaciones", "Exactas y Naturales", "Educación Física", "Ciencias Sociales"];
    let queries = [];

    for (let i = 0; i < areas.length; i++) {
        let area_nombre = areas[i];
        let select_niveles_areas = `
            SELECT 
                niveles_memory.id_nivel,
                niveles_memory.id_area,
                areas.nombre AS nombre_area,
                niveles_memory.id_creador_us,
                niveles_memory.actividad_juego,
                niveles_memory.desc_actividad,
                niveles_memory.fecha_creacion
            FROM niveles_memory
            JOIN areas ON niveles_memory.id_area = areas.materia_id
            WHERE areas.nombre = ?`;

        let queryPromise = new Promise((resolve, reject) => {
            connection.query(select_niveles_areas, [area_nombre], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        queries.push(queryPromise);
    }

    Promise.all(queries)
        .then(results => {
            res.render("juego_intro", { data_juegos_areas: results });
        })
        .catch(err => {
            console.error('Error al cargar los juegos:', err);
            res.status(500).send('Error al cargar los juegos');
        });
});

app.get('/puntaje_us', (req, res) => {

    //http://localhost:5000/puntaje_us?intentos_res=12&aciertos_res=8&tiempo_res=25&intentos_intro=4&tiempo_intro=15&id_nivel=1&id_area=7
    let id_nivel = req.query.id_nivel;
    let id_area = req.query.id_area;
    let intentos_res = req.query.intentos_res;
    let aciertos_res = req.query.aciertos_res;
    let tiempo_res = req.query.tiempo_res;
    let intentos_intro = req.query.intentos_intro;
    let tiempo_intro = req.query.tiempo_intro;
    let puntaje = Math.max(0, (aciertos_res * 100) - (intentos_res * 5) - (tiempo_res * 2));
    let id_us = req.session.usuario_id;
    let fecha_act = Datatime()

    const select_areas = 'INSERT INTO `niveles_us`( `id_nivel`, `id_area`, `id_us`, `fecha`) VALUES ( ?, ?, ?, ?)'
    connection.query(select_areas, [id_nivel, id_area,id_us,fecha_act] , (err, result_juego) => {
        if (err) {
            console.error('Error al registrarse ', err);
            res.status(500).send('Error al registrarse ');
        } else {
            res.render("puntaje_us", { intentos_res, aciertos_res, tiempo_res, intentos_intro, tiempo_intro, puntaje })


        }
    })


});



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



//  <% if (nivel_us == i) { %>
//     <a href="<%= data_juego.url_juego %>?nivel_juego=<%= nivel_us %>" class="nivel actual <%= mover_der %>">
//         <li>
//             <i class="fa-solid fa-star"></i>
//         </li>
//     </a>
// <% } else if (nivel_us > i) { %>
//     <a href="<%= data_juego.url_juego %>?nivel_juego=<%= i%>" class="nivel superado <%= mover_der %>">
//         <li>
//             <i class="fa-solid fa-check"></i>
//         </li>
//     </a>
// <% } else { %>
//     <span href="<%= data_juego.url_juego %>?nivel_juego=<%= i %>" class="nivel no_superado <%= mover_der %>">
//         <li>
//             <i class="fa-solid fa-lock"></i>
//         </li>
//     </span>
