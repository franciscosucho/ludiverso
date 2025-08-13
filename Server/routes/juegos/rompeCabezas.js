const {
    isLogged,
    connection,
    router,
  
} = require('./../../config/dependencies.js');

router.get('/rompecabezas', isLogged, (req, res) => {
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


// Exporta todas las rutas definidas
module.exports = router;