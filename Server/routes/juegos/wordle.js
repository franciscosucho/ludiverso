const {
    isLogged,
    Datatime,
    express,
    session,
    connection,
    multer,
    fs,
    path,
    sharp,
    crypto,
    transporter,
    router,
    upload_nov

} = require('./../../config/dependencies.js');


// // Configuración de express-session
router.use(
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

router.get('/wordle_intro', isLogged, (req, res) => {
    let id_us = req.session.usuario_id;
    res.render("wordle_intro", { session: req.session })

})
router.get('/wordle', isLogged, (req, res) => {

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

router.post('/game-over-wordle', (req, res) => {

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


router.get('/wordle_ranking', isLogged, (req, res) => {

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


// Exporta todas las rutas definidas
module.exports = router;


