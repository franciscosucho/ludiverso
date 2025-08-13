const {
    router,
    connection,
    isLogged

} = require('./../../config/dependencies.js');


router.get('/juego_memoria',isLogged, (req, res) => {
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

router.get('/puntaje_us', isLogged, (req, res) => {

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

// Exporta todas las rutas definidas
module.exports = router;
