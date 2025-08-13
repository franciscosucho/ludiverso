
const {
    isLogged,
    connection,
    router,

} = require('./../config/dependencies.js');

router.get('/areas', isLogged, (req, res) => {
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

// Exporta todas las rutas definidas
module.exports = router;