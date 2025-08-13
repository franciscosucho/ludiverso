

const {
    connection,
    router,
    isLogged,
    flash
} = require('./../config/dependencies.js');

router.use(flash());


router.get('/puntuarJuego', isLogged, (req, res) => {
    try {
        const id_us = req.session.usuario_id;
        const id_juego = req.query.id_juego;


        const mensajesFlash = req.flash('mensaje');
        const mensaje = mensajesFlash.length > 0 ? mensajesFlash[0] : null;

        const select_juegos = 'SELECT * FROM `juegos` WHERE juego_id=?';
        connection.query(select_juegos, [id_juego], (err, result_juegos) => {
            if (err) {
                console.error('Error al ejecutar la query de juegos ', err);
                return res.status(500).send('Error al ejecutar la query de juegos');
            }
            if (result_juegos.length === 0) {

                return res.status(404).send('Juego no encontrado.');
            }

            const juego = result_juegos[0];
            const select_puntaje = 'SELECT * FROM `puntaje_juego` WHERE id_us=? AND id_juego=?';
            connection.query(select_puntaje, [id_us, id_juego], (err, result_query) => {
                if (err) {
                    console.error('Error al ejecutar la query de puntaje ', err);
                    return res.status(500).send('Error al ejecutar la query de puntaje');
                }

                if (result_query.length > 0) {

                    return res.render('puntuarJuego', {
                        mensaje: 'Ya hiciste una calificación de este juego. Si deseas, puedes actualizarla.',
                        id_juego,
                        juego: juego,
                        puntaje: result_query[0],
                        sessionUserId: req.session.usuario_id,
                        session: req.session
                    });
                } else {

                    return res.render('puntuarJuego', {
                        mensaje: mensaje,
                        id_juego,
                        juego: juego,
                        puntaje: null,
                        sessionUserId: req.session.usuario_id,
                        session: req.session
                    });
                }
            });
        });
    } catch (err) {
        console.error('Error al abrir la pagina para puntuar juego:', err);
        return res.status(500).send('Ocurrió un error al abrir la página de puntuación.');
    }
});

router.post('/postPuntuarJuego', (req, res) => {
    try {
        const id_us = req.session.usuario_id;
        const { id_juego, input_diver, input_dificultad, input_diseno, input_punto_fuerte, input_futuro } = req.body;
        console.log(id_juego)
        const insert_puntaje = 'INSERT INTO `puntaje_juego`(`id_juego`, `id_us`, `input_diver`, `input_dificultad`, `input_diseno`, `input_punto_fuerte`, `input_futuro`) VALUES (?,?,?,?,?,?,?)';
        connection.query(insert_puntaje, [id_juego, id_us, input_diver, input_dificultad, input_diseno, input_punto_fuerte, input_futuro], (err, result_juegos) => {
            if (err) {
                console.error('Error al ejecutar la query en el servidor ', err);
                res.status(500).send('Error al ejecutar la query en el servidor');
            } else {
                return res.redirect('/index');
            }
        })
    }
    catch (err) {
        console.error('Error al abrir la pagina principal:', err);
        return res.redirect(`/puntuarJuego?id_juego=${id_juego}`, { error: 'Ocurrio un error al monento de hacer la inserción.' });
    }
});



// Exporta todas las rutas definidas
module.exports = router;