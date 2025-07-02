const express = require('express')
const app = express()

const session = require('express-session')
const mysql = require('mysql2');


const bcrypt = require('bcrypt');
const path = require('path');
const { PORT } = require('./config.js');
const { clave_sesion } = require('./config.js');


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

app.get('/register', (req, res) => {
    res.render('register', { session: req.session });
})


app.post('/registrar', async (req, res) => {
    try {
        const { nombre_us, apellido_us, nombre_usuario_us, email_us, password_us } = req.body;


        const hash = await hashPassword(password_us);
        const insert_usuario = "INSERT INTO usuarios ( nombre , apellido , nombre_usuario , email , contraseña, rol) VALUES (?,?,?,?,?,?)";

        connection.query(insert_usuario, [nombre_us, apellido_us, nombre_usuario_us, email_us, hash, "alumno"], (err, result) => {
            if (err) {
                console.error('Error al registrarse ', err);
                res.status(500).send('Error al registrarse ');
            } else {
                // Usar directamente el ID del usuario recién insertado
                req.session.usuario_id = result.insertId;
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

    } catch (err) {
        console.error('Error en la consulta:', err);
        res.render('register', { error: 'Ocurrio un error al monento de registrase' });
    }


})

/* Toda la logica que tenga el dashboard del admin. 
<--------------------------------------------------------------------------------------------->*/
const dashboardRoutes = require('./routes/dashboard');
app.use('', dashboardRoutes);

/* <---------------------------------------------------------------->*/

/* Toda la logica que tenga el apartado de enviar emails. 
<--------------------------------------------------------------------------------------------->*/
const emailRoutes = require('./routes/email');
app.use('', emailRoutes);

/* <---------------------------------------------------------------->*/


app.post('/iniciar_sesion', async (req, res) => {
    try {
        const { user_name, password } = req.body;

        // Si no se envían credenciales,  renderiza la vista sin error
        if (!user_name?.trim() || !password?.trim()) {

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
                    res.render("areas", { data_areas: result_areas, data_juegos: result_juegos, session: req.session })
                }
            })

        }
    })
})

app.get('/juego_memoria', (req, res) => {
    let id_juego_main = req.query.id_juego;
    let id_juego = req.query.id_nivel;
    id_juego_main = parseInt(id_juego_main)
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
                    res.render("juego_memoria", { data_juego: result_juego, data_resources: result_resources, id_area: id_area, id_nivel: id_nivel, id_juego: id_juego_main, session: req.session })
                }
            })

        }
    })

})

app.get('/juego_intro', (req, res) => {
    let id_juego = req.query.id_juego;
    let id_us = req.session.usuario_id;
    let areas = ["Taller", "Comunicaciones", "Exactas y Naturales", "Educación Física", "Ciencias Sociales"];

    // Promesa para obtener los niveles superados por el usuario
    const getNivelesUsuario = new Promise((resolve, reject) => {
        const select_nivel_us = 'SELECT * FROM `niveles_us` WHERE id_us=? AND id_juego = ?';
        connection.query(select_nivel_us, [id_us, id_juego], (err, result_nl_us) => {
            if (err) reject(err);
            else resolve(result_nl_us);
        });
    });

    // Promesas para obtener niveles por área
    const areaQueries = areas.map(area_nombre => {
        let select_niveles_areas = `
            SELECT 
                niveles_memory.id_nivel,
                niveles_memory.id_area,
                areas.nombre AS nombre_area,
                niveles_memory.id_creador_us,
                niveles_memory.actividad_juego,
                niveles_memory.desc_actividad,
                niveles_memory.fecha_creacion,
                niveles_memory.id_juego 
            FROM niveles_memory
            JOIN areas ON niveles_memory.id_area = areas.materia_id
            WHERE areas.nombre = ? AND  niveles_memory.id_juego =?`;

        return new Promise((resolve, reject) => {
            connection.query(select_niveles_areas, [area_nombre, id_juego], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    });

    // Ejecutar todas las promesas
    Promise.all([getNivelesUsuario, ...areaQueries])
        .then(([result_nl_us, ...result_areas]) => {
            // Filtrar solo las áreas con niveles
            const filtered_areas = result_areas.filter(area => area.length > 0);

            // Mapeamos niveles superados por el usuario por id_area
            const nivelesPorArea = {};

            result_nl_us.forEach(({ id_area, id_nivel }) => {
                if (!nivelesPorArea[id_area]) {
                    nivelesPorArea[id_area] = new Set();
                }
                nivelesPorArea[id_area].add(id_nivel);
            });

            // Determinamos qué niveles desbloquear por cada área
            filtered_areas.forEach(areaNiveles => {
                if (areaNiveles.length > 0) {
                    const id_area = areaNiveles[0].id_area;
                    const nivelesTotales = areaNiveles.map(n => n.id_nivel).sort((a, b) => a - b);

                    const completados = nivelesPorArea[id_area] || new Set();
                    const desbloqueados = new Set();

                    // Siempre desbloqueamos el primer nivel
                    if (nivelesTotales.length > 0) {
                        desbloqueados.add(nivelesTotales[0]);
                    }

                    for (let i = 0; i < nivelesTotales.length; i++) {
                        const actual = nivelesTotales[i];
                        if (completados.has(actual)) {
                            desbloqueados.add(actual);
                            if (i + 1 < nivelesTotales.length) {
                                desbloqueados.add(nivelesTotales[i + 1]);
                            }
                        }
                    }

                    // Convertimos Set a array para pasar al frontend
                    nivelesPorArea[id_area] = Array.from(desbloqueados);
                }
            });

            // Renderizar vista con los datos
            res.render("juego_intro", {
                data_juegos_areas: filtered_areas,
                id_juego,
                data_niveles_us: result_nl_us,
                nivelesPorArea,
                session: req.session
            });
        })
        .catch(err => {
            console.error("Error en /juego_intro:", err);
            res.status(500).send("Error al cargar los niveles");
        });
});



app.get('/puntaje_us', isLogged, (req, res) => {

    let { id_juego, id_nivel, id_area, intentos_res, aciertos_res, tiempo_res, intentos_intro, tiempo_intro } = req.query;
    // let puntaje = Math.max(0, (aciertos_res * 100) - (intentos_res * 5) - (tiempo_res * 2));
    let puntaje = 100
    let id_us = req.session.usuario_id;
    let fecha_act = new Date();

    // Bandera para saber cuándo se puede renderizar
    let estadisticasReady = false;
    let nivelesReady = false;

    function tryRender() {
        if (estadisticasReady && nivelesReady) {
            res.render("puntaje_us", {
                intentos_res,
                aciertos_res,
                tiempo_res,
                intentos_intro,
                tiempo_intro,
                puntaje,
                session: req.session
            });
        }
    }

    // Consulta y actualización/creación de estadisticas
    connection.query('SELECT * FROM `estadisticas` WHERE usuario_id=? AND juego_jugado=? AND `id_nivel`=?', [id_us, id_juego, id_nivel], (err, result_est) => {



        if (err) return res.status(500).send('Error en estadísticas');

        if (result_est.length > 0) {
            // Si ya existe, actualizar solo si el puntaje nuevo es mayor
            if (result_est[0].puntaje_total <= puntaje) {

                connection.query(
                    'UPDATE `estadisticas` SET `puntaje_total`=?, `fecha_actividad`=? WHERE usuario_id=? AND juego_jugado=? AND id_nivel=?',
                    [puntaje, fecha_act, id_us, id_juego, id_nivel],
                    () => {
                        estadisticasReady = true;
                        tryRender();
                    }
                );
            } else {

                estadisticasReady = true;
                tryRender();
            }
        } else {
            // Si no existe, insertar nuevo

            connection.query(

                'INSERT INTO `estadisticas`(`usuario_id`, `juego_jugado`, `puntaje_total`, `fecha_actividad`, `id_nivel`) VALUES (?,?,?,?,?)',
                [id_us, id_juego, puntaje, fecha_act, id_nivel],
                () => {
                    estadisticasReady = true;
                    tryRender();
                }
            );
        }
    });

    // Consulta e inserción en niveles_us
    connection.query('SELECT * FROM `niveles_us` WHERE id_us=? AND id_area=?', [id_us, id_area], (err, result_niv) => {
        if (err) return res.status(500).send('Error en niveles_us');
        let nivel_us = parseInt(id_nivel) + 1;

        if (result_niv.length === 0) {
            connection.query(
                'INSERT INTO `niveles_us`(`id_nivel`, `id_area`, `id_us`, `fecha`, `id_juego`) VALUES (?, ?, ?, ?, ?)',
                [nivel_us, id_area, id_us, fecha_act, id_juego],
                () => {
                    nivelesReady = true;
                    tryRender();
                }
            );
        } else {
            connection.query(
                'UPDATE `niveles_us` SET `id_nivel`= ? ,`fecha`= ? WHERE id_us= ? AND id_area= ? AND id_juego=?',
                [nivel_us, fecha_act, id_us, id_area, id_juego],
                () => {
                    nivelesReady = true;
                    tryRender();
                }
            );
        }
    });
});
// |Wordle| <-------------------------------------------------------------------------------------------------------->
app.get('/wordle_intro', isLogged, (req, res) => {
    let id_us = req.session.usuario_id;
    res.render("wordle_intro", { session: req.session })

})
app.get('/wordle', isLogged, (req, res) => {

    let id_area = req.query.area;
    let select_wordle = ""
    if (id_area == 66) {
        select_wordle = `SELECT * FROM wordle WHERE 1`

    }
    else {
        select_wordle = `SELECT * FROM wordle WHERE id_area=${id_area}`
    }

    connection.query(select_wordle, (err, result_wordle) => {
        if (err) {
            console.error('Error al buscar los datos de Wordle ', err);
            res.status(500).send('Error al buscar los datos de Wordle');
        } else {
            res.render("wordle", { data_wordle: result_wordle, session: req.session })

        }
    })

})

app.post('/game-over-wordle', (req, res) => {
    const { tiempo, aciertos } = req.body;
    let id_us = req.session.usuario_id;
    var date = Datatime()
    
    // Primero guardar TODA partida en el historial
    const insertHistorialQuery = "INSERT INTO `historial_wordle` (`id_us`, `aciertos`, `tiempo`, `fecha`) VALUES (?, ?, ?, ?)";
    
    connection.query(insertHistorialQuery, [id_us, aciertos, tiempo, date], (err, historialResult) => {
        if (err) {
            console.error('Error al guardar en historial:', err);
            return res.status(500).send('Error al registrar partida');
        }

        // Luego actualizar ranking solo si es mejor que el anterior
        const select_nl_wordle = 'SELECT * FROM `rankin_wordle` WHERE id_us=?'
        connection.query(select_nl_wordle, [id_us], (err, result_nl_wordle) => {
            if (err) {
                console.error('Error al consultar ranking:', err);
                return res.status(500).send('Error al consultar ranking');
            } else {
                if (result_nl_wordle.length === 0) {
                    console.log("Primera partida del usuario")
                    const insert_nl_wd = "INSERT INTO `rankin_wordle`( `id_us`, `aciertos`, `tiempo`, `fecha`) VALUES (?,?,?,?)"
                    connection.query(insert_nl_wd, [id_us, aciertos, tiempo, date], (err, result_nl_wordle) => {
                        if (err) {
                            console.error('Error al insertar en ranking:', err);
                            return res.status(500).send('Error al insertar en ranking');
                        }
                    })
                } else {
                    if (aciertos >= result_nl_wordle[0].aciertos) {
                        console.log("Actualizando ranking con mejor puntuación")
                        const update_nl_wd = "UPDATE `rankin_wordle` SET `aciertos`=?,`tiempo`=?,`fecha`=? WHERE id_us=?"
                        connection.query(update_nl_wd, [aciertos, tiempo, date, id_us], (err, result_nl_wordle) => {
                            if (err) {
                                console.error('Error al actualizar ranking:', err);
                                return res.status(500).send('Error al actualizar ranking');
                            }
                        })
                    } else {
                        console.log("Manteniendo mejor puntuación anterior")
                    }
                }
            }
        });

        console.log(`Juego terminado. Tiempo: ${tiempo}, Aciertos: ${aciertos}`);
        res.status(200).send({ success: true });
    });
});


app.get('/wordle_ranking', isLogged, (req, res) => {

    const select_wordle = `SELECT 
    r.id_ranking,
    r.aciertos,
    r.tiempo,
    r.fecha,
    u.nombre,
    u.apellido,
    u.nombre_usuario
FROM 
    rankin_wordle r
JOIN 
    usuarios u ON r.id_us = u.usuario_id
ORDER BY 
    r.aciertos DESC, r.tiempo ASC;`
    connection.query(select_wordle, (err, result_wordle) => {
        if (err) {
            console.error('Error al buscar los datos de Wordle ', err);
            res.status(500).send('Error al buscar los datos de Wordle');
        } else {
            res.render("wordle_ranking", { data_wordle: result_wordle, session: req.session })

        }
    })

})


// |Wordle| <-------------------------------------------------------------------------------------------------------->



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
    const pad = n => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}


// rutas para el juego del ahorcado
app.get('/ahorcado_intro', isLogged, (req, res) => {
    const select_areas = 'SELECT * FROM areas';
    connection.query(select_areas, [], (err, areas) => {
        if (err) {
            console.error('Error al obtener las áreas:', err);
            res.status(500).send('Error al obtener las áreas');
        } else {
            res.render('ahorcado_intro', { areas, session: req.session });
        }
    });
});

app.get('/ahorcado', isLogged, (req, res) => {
    const materiaId = req.query.materia;

    // bbtener una palabra aleatoria de la materia seleccionada
    const select_palabra = 'SELECT palabra, pista FROM palabras_ahorcado WHERE materia_id = ? ORDER BY RAND() LIMIT 1';
    connection.query(select_palabra, [materiaId], (err, result) => {
        if (err) {
            console.error('Error al obtener la palabra:', err);
            res.status(500).send('Error al obtener la palabra');
        } else if (result.length === 0) {
            res.status(404).send('No se encontraron palabras para esta materia');
        } else {
            res.render('ahorcado', {
                palabra: result[0].palabra,
                pista: result[0].pista
                , session: req.session
            });
        }
    });
});

app.post('/game-over-ahorcado', isLogged, (req, res) => {
    const { tiempo, aciertos, intentos_fallidos, victoria, palabra_jugada, id_area } = req.body;
    const id_us = req.session.usuario_id;
    const date = Datatime();

    // Primero guardar TODA partida en el historial
    const insertHistorialQuery = "INSERT INTO `historial_ahorcado` (`id_us`, `id_area`, `aciertos`, `intentos_fallidos`, `tiempo`, `victoria`, `palabra_jugada`, `fecha`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    connection.query(insertHistorialQuery, [id_us, id_area, aciertos, intentos_fallidos, tiempo, victoria, palabra_jugada, date], (err, historialResult) => {
        if (err) {
            console.error('Error al guardar en historial:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar partida' });
        }

        // Solo actualizar ranking si es victoria
        if (victoria) {
            // Verificar si el usuario ya tiene una puntuación para esta área
            const checkQuery = "SELECT * FROM `ranking_ahorcado` WHERE id_us = ? AND id_area = ? AND victoria = 1";
            connection.query(checkQuery, [id_us, id_area], (err, existingRecords) => {
                if (err) {
                    console.error('Error al consultar ranking:', err);
                    return res.status(500).json({ success: false, message: 'Error al registrar puntuación' });
                }

                // Si el usuario ya tiene registros, verificamos si el nuevo es mejor
                if (existingRecords.length > 0) {
                    const bestRecord = existingRecords.reduce((best, current) => {
                        // Primero comparamos por aciertos (más es mejor)
                        if (current.aciertos > best.aciertos) return current;
                        if (current.aciertos < best.aciertos) return best;

                        // Si los aciertos son iguales, comparamos por tiempo (menos es mejor)
                        if (current.tiempo < best.tiempo) return current;
                        if (current.tiempo > best.tiempo) return best;

                        // Si el tiempo es igual, comparamos por intentos fallidos (menos es mejor)
                        return current.intentos_fallidos < best.intentos_fallidos ? current : best;
                    });

                    // Si la nueva puntuación es mejor, actualizamos el registro
                    if (aciertos > bestRecord.aciertos ||
                        (aciertos === bestRecord.aciertos && tiempo < bestRecord.tiempo) ||
                        (aciertos === bestRecord.aciertos && tiempo === bestRecord.tiempo && intentos_fallidos < bestRecord.intentos_fallidos)) {

                        const updateQuery = `
                            UPDATE ranking_ahorcado 
                            SET aciertos = ?, 
                                intentos_fallidos = ?, 
                                tiempo = ?, 
                                victoria = ?, 
                                palabra_jugada = ?, 
                                fecha = ?
                            WHERE id_us = ? AND id_area = ? AND victoria = 1
                        `;

                        connection.query(updateQuery,
                            [aciertos, intentos_fallidos, tiempo, victoria, palabra_jugada, date, id_us, id_area],
                            (err, result) => {
                                if (err) {
                                    console.error('Error al actualizar ranking:', err);
                                    return res.status(500).json({ success: false, message: 'Error al actualizar puntuación' });
                                }
                                res.json({ success: true, message: 'Puntuación actualizada correctamente' });
                            }
                        );
                    } else {
                        // Si la nueva puntuación no es mejor, mantenemos la existente
                        res.json({ success: true, message: 'Se mantiene la mejor puntuación anterior' });
                    }
                } else {
                    // Si no existe registro previo, insertamos uno nuevo
                    const insertQuery = "INSERT INTO `ranking_ahorcado` (`id_us`, `id_area`, `aciertos`, `intentos_fallidos`, `tiempo`, `victoria`, `palabra_jugada`, `fecha`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(insertQuery,
                        [id_us, id_area, aciertos, intentos_fallidos, tiempo, victoria, palabra_jugada, date],
                        (err, result) => {
                            if (err) {
                                console.error('Error al insertar en ranking:', err);
                                return res.status(500).json({ success: false, message: 'Error al registrar puntuación' });
                            }
                            res.json({ success: true, message: 'Puntuación registrada correctamente' });
                        }
                    );
                }
            });
        } else {
            // Si no es victoria, solo responder que se guardó en el historial
            res.json({ success: true, message: 'Partida registrada en el historial' });
        }
    });
});

app.get('/ahorcado_ranking', isLogged, (req, res) => {
    const area = req.query.area;
    let query = `
        WITH RankedScores AS (
            SELECT 
                r.*,
                u.nombre_usuario,
                a.nombre as nombre_area,
                ROW_NUMBER() OVER (
                    PARTITION BY r.id_us, r.id_area 
                    ORDER BY r.aciertos DESC, r.tiempo ASC
                ) as rn
            FROM ranking_ahorcado r 
            JOIN usuarios u ON r.id_us = u.usuario_id 
            JOIN areas a ON r.id_area = a.materia_id
            WHERE r.victoria = 1
    `;

    const params = [];
    if (area) {
        query += ' AND r.id_area = ?';
        params.push(area);
    }

    query += `) 
        SELECT * FROM RankedScores 
        WHERE rn = 1 
        ORDER BY aciertos DESC, tiempo ASC`;

    // Primero obtenemos todas las áreas para el filtro
    connection.query('SELECT * FROM areas', (err, areas) => {
        if (err) {
            console.error('Error al obtener áreas:', err);
            res.status(500).send('Error al cargar el ranking');
            return;
        }

        // Luego obtenemos los datos del ranking
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al obtener ranking:', err);
                res.status(500).send('Error al cargar el ranking');
            } else {
                res.render('ahorcado_ranking', {
                    data_ahorcado: result,
                    areas: areas,
                    selectedArea: area,
                    area: area,
                    session: req.session
                });
            }
        });
    });
});

app.get('/next-word', isLogged, (req, res) => {
    const area = req.query.area;
    const completed = parseInt(req.query.completed);
    const usedWords = req.query.usedWords ? req.query.usedWords.split(',') : [];

    // Primero obtener el total de palabras para el área
    const countQuery = 'SELECT COUNT(*) as total FROM palabras_ahorcado WHERE materia_id = ?';
    connection.query(countQuery, [area], (err, countResult) => {
        if (err) {
            console.error('Error al contar palabras:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        const totalWords = countResult[0].total;

        if (completed >= totalWords) {
            // Ya completó todas las palabras del área
            res.json({ completed: true });
        } else {
            // Obtener la siguiente palabra aleatoria que no haya sido usada
            const wordQuery = `
                SELECT palabra, pista 
                FROM palabras_ahorcado 
                WHERE materia_id = ? 
                AND palabra NOT IN (?)
                ORDER BY RAND() 
                LIMIT 1
            `;

            connection.query(wordQuery, [area, usedWords], (err, wordResult) => {
                if (err) {
                    console.error('Error al obtener palabra:', err);
                    return res.status(500).json({ error: 'Error del servidor' });
                }

                if (wordResult.length === 0) {
                    // Si no hay más palabras disponibles
                    res.json({ completed: true });
                } else {
                    res.json({
                        completed: false,
                        palabra: wordResult[0].palabra,
                        pista: wordResult[0].pista
                    });
                }
            });
        }
    });
});

app.get('/rompecabezas', isLogged, (req, res) => {
    let id_juego_main = req.query.id_juego;
    let id_juego = req.query.id_nivel;
    id_juego_main = parseInt(id_juego_main)
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
                    res.render("rompecabezas", { data_juego: result_juego, data_resources: result_resources, id_area: id_area, id_nivel: id_nivel, id_juego: id_juego_main, session: req.session })
                }
            })

        }
    })

});

app.get('/exactas', isLogged, (req, res) => {

    res.render('exactas', {
        session: req.session
    });

});
app.get('/sobre_nosotros', isLogged, (req, res) => {
    try {
        const select_juegos = 'SELECT j.*, m.nombre AS nombre_materia FROM juegos j JOIN areas m ON j.materia_id = m.materia_id';
        connection.query(select_juegos, [], (err, result_juegos) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor ', err);
                res.status(500).send('Error al ejecutar la query en el servidor');
            } else {
                res.render('sobre_nosotros', { juegos: result_juegos, sessionUserId: req.session.usuario_id, session: req.session });
            }
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('sobre_nosotros', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

});

module.exports = {
    hashPassword,
    verifyPassword,
    Datatime
};



