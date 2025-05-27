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
    res.render('login');
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
        const insert_usuario = "INSERT INTO usuarios ( nombre , apellido , nombre_usuario , email , contraseña, rol) VALUES (?,?,?,?,?,?)";

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
/* Toda la logica que tenga el dashboard del admin. 
<--------------------------------------------------------------------------------------------->*/
app.get('/dashboard', root_verificar, async (req, res) => {
    try {
        res.render('dashboard/dashboard', { user_session_nombre: req.session.nombre_us });

    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dashboard/dashboard', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

})

app.get('/dash_users', root_verificar, async (req, res) => {
    const { usuario_id, nombre, apellido, nombre_usuario, email, rol } = req.query;

    try {
        let query = `
            SELECT 
                usuario_id, nombre, apellido, nombre_usuario, email, contraseña, rol 
            FROM 
                usuarios 
            WHERE 1
        `;
        const params = [];

        if (usuario_id) {
            query += ' AND usuario_id = ?';
            params.push(usuario_id);
        }
        if (nombre) {
            query += ' AND nombre LIKE ?';
            params.push(`%${nombre}%`);
        }
        if (apellido) {
            query += ' AND apellido LIKE ?';
            params.push(`%${apellido}%`);
        }
        if (nombre_usuario) {
            query += ' AND nombre_usuario LIKE ?';
            params.push(`%${nombre_usuario}%`);
        }
        if (email) {
            query += ' AND email LIKE ?';
            params.push(`%${email}%`);
        }
        if (rol) {
            query += ' AND rol = ?';
            params.push(rol);
        }

        connection.query(query, params, (err, result_users) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }

            res.render('dashboard/dash_users', {
                users_res: result_users,
                user_session_nombre: req.session.nombre_us
            });
        });
    } catch (err) {
        console.error('Error al abrir la página principal:', err);
        res.render('dashboard', {
            error: 'Ocurrió un error al momento de abrir la página principal'
        });
    }
});

app.post('/borrar_user', async (req, res) => {
    let id_user = req.body.id_user;

    let delete_query = "DELETE FROM `usuarios` WHERE usuario_id = ?";
    connection.query(delete_query, [id_user], (err, result_users) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.redirect('/dashboard/dash_users');
    });
});
app.get('/editar_user', async (req, res) => {
    let id_user = req.query.id_user;

    let query_select = "SELECT * FROM `usuarios` WHERE  usuario_id=?";
    connection.query(query_select, [id_user], (err, result_users) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.render('editar_user', { data_user: result_users });
    });
});

app.post('/editar_us_post', (req, res) => {
    let { id_userss, rol_us } = req.body;
    console.log(rol_us)

    let query_select = "UPDATE `usuarios` SET `rol`=? WHERE usuario_id=?";
    connection.query(query_select, [rol_us, id_userss], (err, result_users) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.redirect('/dashboard//dash_users');
    });
})

app.get('/dash_novedades', async (req, res) => {
    try {
        let query_select = "SELECT * FROM `novedades` WHERE 1";
        connection.query(query_select, (err, result_nov) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.render('dashboard/dash_novedades', { novedades: result_nov });
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_novedades', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }
});
app.post('/borrar_novedad', async (req, res) => {
    let { input_borrar_nov } = req.body;


    let delete_query = "DELETE FROM `novedades` WHERE `id_novedad`=?";
    connection.query(delete_query, [input_borrar_nov], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.redirect('dashboard/dash_novedades');
    });
});

app.get('/dash_nov_editar', async (req, res) => {
    let { input_editar } = req.query;

    let select_query = "SELECT * FROM `novedades` WHERE `id_novedad`=?";
    connection.query(select_query, [input_editar], (err, results_nov) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.render('dashboard/dash_nov_editar', { novedad: results_nov });
    });
});
app.post('/editar_novedad', upload_nov.single('url_nov'), (req, res) => {
    const { id_novedad, titulo_novedad, subtitulo_novedad, cuerpo_novedad, fecha_novedad } = req.body;
    let url_foto_novedad;
    console.log(id_novedad)
    if (req.file) {
        url_foto_novedad = 'Resources/Imagenes/Novedades/' + req.file.filename;
    }

    // Construimos la query SQL
    let updateQuery = `
        UPDATE novedades 
        SET titulo_novedad = ?, subtitulo_novedad = ?, cuerpo_novedad = ?, fecha_novedad = ?
        ${url_foto_novedad ? ', url_foto_novedad = ?' : ''}
        WHERE id_novedad = ?
    `;

    // Valores a insertar en la query
    let values = [
        titulo_novedad,
        subtitulo_novedad,
        cuerpo_novedad,
        fecha_novedad
    ];

    if (url_foto_novedad) values.push(url_foto_novedad);
    values.push(id_novedad);

    connection.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar novedad:', err);
            return res.status(500).send('Error al actualizar novedad');
        }

        res.redirect('/dashboard');
    });
});



// Ruta para recibir el archivo
app.post('/dash_agregar_nov', upload_nov.single('url_nov'), (req, res) => {
    let { titulo_nov, subtitulo_nov, cuerpo_nov } = req.body;
    let fecha = Datatime()

    console.log(req.file);
    let url_img = saveImage(req.file);
    if (!req.file) {
        return res.status(400).send('No se subió ninguna imagen');
    }
    else {
        let query_select = "INSERT INTO `novedades`( `titulo_novedad`, `subtitulo_novedad`, `cuerpo_novedad`, `url_foto_novedad`, `fecha_novedad`) VALUES (?, ?, ? , ?, ?) ";
        connection.query(query_select, [titulo_nov, subtitulo_nov, cuerpo_nov, url_img, fecha], (err, result_users) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }

            res.redirect('/dashboard/dash_novedades');
        });
    }

});


app.get('/dash_juegos', root_verificar, async (req, res) => {

    try {
        let query_select = "SELECT * FROM `juegos` WHERE 1";
        connection.query(query_select, (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.render('dashboard/dash_juegos', { juegos: result_juego });
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_juegos', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

})
app.get('/dash_wordle', root_verificar, async (req, res) => {

    try {
        let query_select = "SELECT * FROM `wordle` WHERE 1";
        connection.query(query_select, (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.render('dashboard/dash_wordle', { juegos: result_juego });
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_wordle', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

})

function saveImage(file) {
    const url_nov = `Resources/Imagenes/Novedades/${file.originalname}`
    const newPath = path.join(__dirname, '../Client/Resources/Imagenes/Novedades/', file.originalname);
    fs.renameSync(file.path, newPath);
    return url_nov;
}



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
                    res.render("areas", { data_areas: result_areas, data_juegos: result_juegos })
                }
            })

        }
    })
})

app.get('/juego_memoria', (req, res) => {
    let id_juego_main = req.query.id_juego;
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
                    res.render("juego_memoria", { data_juego: result_juego, data_resources: result_resources, id_area: id_area, id_nivel: id_nivel, id_juego: id_juego_main })
                }
            })

        }
    })

})
app.get('/juego_intro', (req, res) => {
    let id_juego = req.query.id_juego;
    let id_us = req.session.usuario_id;
    let areas = ["Taller", "Comunicaciones", "Exactas y Naturales", "Educación Física", "Ciencias Sociales"];

    // Promesa para obtener los niveles del usuario
    const getNivelesUsuario = new Promise((resolve, reject) => {
        const select_nivel_us = 'SELECT * FROM `niveles_us` WHERE id_us=?';
        connection.query(select_nivel_us, [id_us], (err, result_nl_us) => {
            if (err) {
                reject(err);
            } else {
                resolve(result_nl_us);
            }
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
                niveles_memory.fecha_creacion
            FROM niveles_memory
            JOIN areas ON niveles_memory.id_area = areas.materia_id
            WHERE areas.nombre = ?`;

        return new Promise((resolve, reject) => {
            connection.query(select_niveles_areas, [area_nombre], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });

    // Ejecutar todas las promesas
    Promise.all([getNivelesUsuario, ...areaQueries])
        .then(([result_nl_us, ...result_areas]) => {
            res.render("juego_intro", {
                data_juegos_areas: result_areas,
                id_juego,
                data_niveles_us: result_nl_us
            });
        })
        .catch(err => {
            console.error('Error al cargar los datos:', err);
            res.status(500).send('Error al cargar los datos');
        });
});


app.get('/puntaje_us', (req, res) => {

    let { id_juego, id_nivel, id_area, intentos_res, aciertos_res, tiempo_res, intentos_intro, tiempo_intro } = req.query;
    let puntaje = Math.max(0, (aciertos_res * 100) - (intentos_res * 5) - (tiempo_res * 2));
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
                puntaje
            });
        }
    }

    // Consulta y actualización/creación de estadisticas
    connection.query('SELECT * FROM `estadisticas` WHERE usuario_id=? AND juego_jugado=?', [id_us, id_juego], (err, result_est) => {
        if (err) return res.status(500).send('Error en estadísticas');

        if (result_est.length > 0) {
            // Si ya existe, actualizar solo si el puntaje nuevo es mayor
            if (result_est[0].puntaje_total <= puntaje) {
                connection.query(
                    'UPDATE `estadisticas` SET `puntaje_total`=?, `fecha_actividad`=? WHERE usuario_id=? AND juego_jugado=?',
                    [puntaje, fecha_act, id_us, id_juego],
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
                'INSERT INTO `estadisticas`(`usuario_id`, `juego_jugado`, `puntaje_total`, `fecha_actividad`) VALUES (?, ?, ?, ?)',
                [id_us, id_juego, puntaje, fecha_act],
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
                'INSERT INTO `niveles_us`( `id_nivel`, `id_area`, `id_us`, `fecha`) VALUES (?, ?, ?, ?)',
                [nivel_us, id_area, id_us, fecha_act],
                () => {
                    nivelesReady = true;
                    tryRender();
                }
            );
        } else {
            connection.query(
                'UPDATE `niveles_us` SET `id_nivel`= ? ,`fecha`= ? WHERE id_us= ? AND id_area= ?',
                [nivel_us, fecha_act, id_us, id_area],
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
    console.log(id_us)
    res.render("wordle_intro", {})

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
            res.render("wordle", { data_wordle: result_wordle })

        }
    })

})

app.post('/game-over-wordle', (req, res) => {
    const { tiempo, aciertos } = req.body;
    let id_us = req.session.usuario_id;
    console.log(id_us)
    var date = Datatime()
    const insert_nl_wd = "INSERT INTO `rankin_wordle`( `id_us`, `aciertos`, `tiempo`, `fecha`) VALUES (?,?,?,?)"
    const update_nl_wd = "UPDATE `rankin_wordle` SET `aciertos`=?,`tiempo`=?,`fecha`=? WHERE id_us=?"
    //
    const select_nl_wordle = 'SELECT * FROM `rankin_wordle` WHERE id_us=?'
    connection.query(select_nl_wordle, [id_us], (err, result_nl_wordle) => {
        if (err) {
            console.error('Error al registrarse ', err);
            res.status(500).send('Error al registrarse ');
        } else {
            if (result_nl_wordle.length === 0) {
                console.log("no hay datos anteriores datos")
                connection.query(insert_nl_wd, [id_us, aciertos, tiempo, date, id_us], (err, result_nl_wordle) => {
                    if (err) {
                        console.error('Error al registrarse ', err);
                        res.status(500).send('Error al registrarse ');
                    }
                })
            } else {
                if (aciertos >= select_nl_wordle[0].aciertos) {
                    console.log("actulizando los datos")
                    connection.query(update_nl_wd, [aciertos, tiempo, date, id_us], (err, result_nl_wordle) => {
                        if (err) {
                            console.error('Error al registrarse ', err);
                            res.status(500).send('Error al registrarse ');
                        }
                    })
                }
            }
            console.log("No se actulizaron  los datos")
        }
    })


    console.log(`Juego terminado. Palabra:  Tiempo: ${tiempo}, Aciertos: ${aciertos}`);
    res.status(200).send({ success: true });
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
            res.render("wordle_ranking", { data_wordle: result_wordle })

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
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


// rutas para el juego del ahorcado
app.get('/ahorcado_intro', isLogged, (req, res) => {
    console.log('Accediendo a /ahorcado_intro');
    const select_areas = 'SELECT * FROM areas';
    connection.query(select_areas, [], (err, areas) => {
        if (err) {
            console.error('Error al obtener las áreas:', err);
            res.status(500).send('Error al obtener las áreas');
        } else {
            console.log('Áreas obtenidas:', areas);
            res.render('ahorcado_intro', { areas });
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
            });
        }
    });
});



