// server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const connection = require('./../config/db.js');
const multer = require('multer');
const fs = require('fs');
const upload_nov = multer({ dest: 'uploads/' }); // Carpeta temporal

// Middleware
const root_verificar = (req, res, next) => {
    if (req.session.root === true) {
        next();
    } else {
        res.redirect('/');
    }
};

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
        let query_select = "SELECT * FROM `wordle` WHERE 1";
        connection.query(query_select, (err, result_juego) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor', err);
                return res.status(500).send('Error al ejecutar la query en el servidor');
            }
            res.render('dashboard/dash_wordle', { juegos: result_juego, session: req.session });
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


// Exporta todas las rutas definidas
module.exports = router;
