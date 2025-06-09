// server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const connection = require('./../config/db.js');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const upload_nov = multer({ dest: 'uploads/' }); // Carpeta temporal
const sharp = require("sharp")
const crypto = require('crypto');
function saveImage(file) {
    const url_nov = `Resources/Imagenes/Novedades/${file.originalname}`
    const newPath = path.join(__dirname, '../Client/Resources/Imagenes/Novedades/', file.originalname);
    fs.renameSync(file.path, newPath);
    return url_nov;
}
const isLogged = (req, res, next) => {
    if (req.session.user_sesion == '' || typeof req.session.user_sesion == 'undefined') {
        res.redirect('/')
    } else {
        next()
    }
}

// Middleware
const root_verificar = (req, res, next) => {
    if (req.session.root === true) {
        next();
    } else {
        res.redirect('/');
    }
};

// Almacenamiento personalizado (puede usar `originalname` si querés)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Client/Resources/Imagenes/juego_memoria"); // asegurate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    },
});

const upload_juego = multer({ storage });

// Aceptar múltiples imágenes con el mismo nombre
const uploadMultiple = upload_juego.fields([
    { name: "imagenes[]", maxCount: 8 }, // debe coincidir exactamente con el name del input
]);



// Estrategia de almacenamiento en memoria
const storageStrategy = multer.memoryStorage();
const uploadMultiple_sharp = multer({ storage: storageStrategy });





// Rutas
router.get('/dashboard', root_verificar, async (req, res) => {
    try {
        res.render('dashboard/dashboard', { user_session_nombre: req.session.nombre_us, session: req.session });

    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dashboard/dashboard', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

})

router.get('/dash_users', root_verificar, async (req, res) => {
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
                user_session_nombre: req.session.nombre_us,
                session: req.session
            });
        });
    } catch (err) {
        console.error('Error al abrir la página principal:', err);
        res.render('dashboard', {
            error: 'Ocurrió un error al momento de abrir la página principal'
        });
    }
});




router.post('/borrar_user', async (req, res) => {
    let id_user = req.body.id_user;

    let delete_query = "DELETE FROM `usuarios` WHERE usuario_id = ?";
    connection.query(delete_query, [id_user], (err, result_users) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.redirect('/dash_users');
    });
});


router.get('/editar_user', async (req, res) => {
    let id_user = req.query.id_user;

    let query_select = "SELECT * FROM `usuarios` WHERE  usuario_id=?";
    connection.query(query_select, [id_user], (err, result_users) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.render('editar_user', { data_user: result_users, session: req.session });
    });
});

router.post('/editar_us_post', (req, res) => {
    let { id_userss, rol_us } = req.body;
    console.log(rol_us)

    let query_select = "UPDATE `usuarios` SET `rol`=? WHERE usuario_id=?";
    connection.query(query_select, [rol_us, id_userss], (err, result_users) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.redirect('/dash_users');
    });
})

router.get('/dash_novedades', async (req, res) => {
    try {
        let query_select = "SELECT * FROM `novedades` WHERE 1";
        connection.query(query_select, (err, result_nov) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.render('dashboard/dash_novedades', { novedades: result_nov, session: req.session });
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_novedades', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }
});
router.post('/borrar_novedad', async (req, res) => {
    let { input_borrar_nov } = req.body;


    let delete_query = "DELETE FROM `novedades` WHERE `id_novedad`=?";
    connection.query(delete_query, [input_borrar_nov], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.redirect('dash_novedades');
    });
});

router.get('/dash_nov_editar', async (req, res) => {
    let { input_editar } = req.query;

    let select_query = "SELECT * FROM `novedades` WHERE `id_novedad`=?";
    connection.query(select_query, [input_editar], (err, results_nov) => {
        if (err) {
            console.error('Error al ejecutar la query en el servidor', err);
            return res.status(500).send('Error al ejecutar la query en el servidor');
        }

        res.render('dashboard/dash_nov_editar', { novedad: results_nov, session: req.session });
    });
});
router.post('/editar_novedad', upload_nov.single('url_nov'), (req, res) => {
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
router.post('/dash_agregar_nov', upload_nov.single('url_nov'), (req, res) => {
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

            res.redirect('/dash_novedades');
        });
    }

});


router.get('/dash_juegos', root_verificar, async (req, res) => {

    try {
        let query_select = "SELECT * FROM `juegos` WHERE 1";
        connection.query(query_select, (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.render('dashboard/dash_juegos', { juegos: result_juego, session: req.session });
        })
    }

    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_juegos', { error: 'Ocurrio un error al monento de abrir la pagina principal' });
    }

})
router.get('/dash_wordle', root_verificar, async (req, res) => {
    try {
        const query_wordle = "SELECT * FROM `wordle` WHERE 1";
        connection.query(query_wordle, (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la primera query', err);
                return res.status(500).send('Error en la primera consulta');
            }

            const query_areas = "SELECT * FROM `areas` WHERE 1";
            connection.query(query_areas, (err, result_juego_areas) => {
                if (err) {
                    console.error('Error al ejecutar la segunda query', err);
                    return res.status(500).send('Error en la segunda consulta');
                }

                res.render('dashboard/dash_wordle', {
                    palabras: result_juego,
                    session: req.session,
                    areas: result_juego_areas
                });
            });
        });

    } catch (err) {
        console.error('Error al abrir la página:', err);
        res.status(500).render('dashboard/dash_wordle', {
            error: 'Ocurrió un error al abrir la página principal'
        });
    }
});



router.post('/borrar_wordle', async (req, res) => {
    let { id_palabra } = req.body;
    console.log("ID a borrar:", id_palabra);

    try {
        let DELETE_word = "DELETE FROM `wordle` WHERE `id_palabra`=?";
        connection.query(DELETE_word, [id_palabra], (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.redirect('dash_wordle');
        });
    } catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_wordle', { error: 'Ocurrió un error al momento de abrir la página principal' });
    }
});

router.post("/editar_palabra_wordle", async (req, res) => {
    let { input_id, input_area, input_palabra, input_desc } = req.body;
    try {
        let edit_word = "UPDATE `wordle` SET `id_area`=?,`palabra`=?,`descrip`=? WHERE id_palabra=?";
        connection.query(edit_word, [input_area, input_palabra, input_desc, input_id], (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.redirect('dash_wordle');
        });
    } catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dash_wordle', { error: 'Ocurrió un error al momento de abrir la página principal' });
    }
});
router.get("/dash_memory", isLogged, async (req, res) => {
    try {
        let select_memory = "SELECT * FROM `niveles_memory` WHERE id_juego=3 ORDER BY `id_nivel` DESC;";
        connection.query(select_memory, (err, result_memory) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            } else {
                let niveles_resources = []
                for (let index = 0; index < result_memory.length; index++) {
                    if (result_memory[index].id_juego == 3) {
                        let nivel = result_memory[index].id_nivel
                        niveles_resources.push(nivel);
                        
                    }

                }
                if (niveles_resources.length === 0) {
                    return res.status(404).send("No se encontraron niveles");
                }

                // Convertir a cadena para la consulta SQL
                let nivelesSQL = niveles_resources.join(',');

                // Consulta solo con los niveles deseados
                let select_resources = `SELECT * FROM resources_juego WHERE id_nivel IN (${nivelesSQL})`;
                connection.query(select_resources, (err, result_resources) => {
                    if (err) {
                        console.error('Error al ejecutar la query en el servidor', err);
                        return res.status(500).send('Error al ejecutar la query en el servidor');
                    } else {
                        const query_areas = "SELECT * FROM `areas` WHERE 1";
                        connection.query(query_areas, (err, data_areas) => {
                            if (err) {
                                console.error('Error al ejecutar la segunda query', err);
                                return res.status(500).send('Error en la segunda consulta');
                            }
                            res.render('dashboard/dash_memory', { niveles: result_memory, resources: result_resources, session: req.session, areas: data_areas, id_juego: 3 });
                        });

                    }

                })
            }

        });
    } catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dashboard/dash_memory', { error: 'Ocurrió un error al momento de abrir la página principal' });
    }
});






router.post("/dash_agregar_juego", uploadMultiple_sharp.array('imagenes'), async (req, res) => {
    try {
        console.log(req.files);
        let fecha = Datatime();
        let id_us = req.session.usuario_id;
        const { titulo_juego, subtitulo_juego, tiempo, titulos_img, area, descripciones_img, id_juego } = req.body;

        const archivos = req.files;

        if (!archivos || archivos.length !== titulos_img.length) {
            return res.status(400).send("Cantidad de imágenes y datos no coinciden");
        }

        const outputPath = path.join(__dirname, '../../Client/Resources/Imagenes/juego_memoria');
        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

        // Este array almacenará los nombres aleatorios generados
        const nombresFinales = [];

        for (const archivo of archivos) {
            const buffer = await sharp(archivo.buffer)
                .webp({ quality: 80 })
                .toBuffer();

            let nombreAleatorio;
            do {
                nombreAleatorio = crypto.randomBytes(8).toString('hex') + ".webp";
            } while (fs.existsSync(path.join(outputPath, nombreAleatorio)));

            fs.writeFileSync(path.join(outputPath, nombreAleatorio), buffer);
            nombresFinales.push(nombreAleatorio);


        }
        const imagenesData = archivos.map((archivo, i) => ({
            archivo: nombresFinales[i], // ← el nombre con el que se guardó
            titulo: titulos_img[i],
            descripcion: descripciones_img[i],
        }));

        // Inserción en DB 
        let insertJuego = "INSERT INTO `niveles_memory`(`id_area`, `id_creador_us`, `actividad_juego`, `desc_actividad`, `tiempo_para_resolver`, `fecha_creacion`,`id_juego`) VALUES (?, ?, ?, ?, ?, ?,?)";
        connection.query(insertJuego, [area, id_us, titulo_juego, subtitulo_juego, tiempo, fecha, id_juego], (err, result_juego) => {
            if (err) {
                console.error('Error al insertar el juego:', err);
                return res.status(500).send('Error al insertar el juego');
            }

            let id_nivel_insertado = result_juego.insertId;

            imagenesData.forEach(imagen => {
                let insertImg = "INSERT INTO `resources_juego`(`id_nivel`, `url_img`, `titulo_img`, `descripcion_img`) VALUES (?, ?, ?, ?)";
                connection.query(insertImg, [id_nivel_insertado, imagen.archivo, imagen.titulo, imagen.descripcion], (err) => {
                    if (err) {
                        console.error('Error al insertar imagen:', err);
                    }
                });
            });

            res.redirect('dash_memory');
        });


    } catch (err) {
        console.error("Error al procesar el juego:", err);
    }
});


router.get("/dash_rompecabezas", isLogged, async (req, res) => {
 try {
        let select_memory = "SELECT * FROM `niveles_memory` WHERE id_juego=2 ORDER BY `id_nivel` DESC;";
        connection.query(select_memory, (err, result_memory) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            } else {
                let niveles_resources = []
                for (let index = 0; index < result_memory.length; index++) {
                    if (result_memory[index].id_juego == 3) {
                        let nivel = result_memory[index].id_nivel
                        niveles_resources.push(nivel);
                         console.log(nivel)
                    }
                   
                }
                if (niveles_resources.length === 0) {
                    return res.status(404).send("No se encontraron niveles");
                }

                // Convertir a cadena para la consulta SQL
                let nivelesSQL = niveles_resources.join(',');

                // Consulta solo con los niveles deseados
                let select_resources = `SELECT * FROM resources_juego WHERE id_nivel IN (${nivelesSQL})`;
                connection.query(select_resources, (err, result_resources) => {
                    if (err) {
                        console.error('Error al ejecutar la query en el servidor', err);
                        return res.status(500).send('Error al ejecutar la query en el servidor');
                    } else {
                        const query_areas = "SELECT * FROM `areas` WHERE 1";
                        connection.query(query_areas, (err, data_areas) => {
                            if (err) {
                                console.error('Error al ejecutar la segunda query', err);
                                return res.status(500).send('Error en la segunda consulta');
                            }
                            res.render('dashboard/dash_rompecabezas', { niveles: result_memory, resources: result_resources, session: req.session, areas: data_areas, id_juego: 3 });
                        });

                    }

                })
            }

        });
    } catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        res.render('dashboard/dash_memory', { error: 'Ocurrió un error al momento de abrir la página principal' });
    }
});






// Exporta todas las rutas definidas
module.exports = router;
function Datatime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

