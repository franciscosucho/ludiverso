
const {
    isLogged,
    connection,
    router,

} = require('./../config/dependencies.js');

router.get('/sobre_nosotros', isLogged, (req, res) => {
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


// Exporta todas las rutas definidas
module.exports = router;