const {
    isLogged,
    Datatime,
    connection,
    router,
} = require('./../../config/dependencies.js');


router.get('/juego_intro', isLogged, (req, res) => {
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


// Exporta todas las rutas definidas
module.exports = router;