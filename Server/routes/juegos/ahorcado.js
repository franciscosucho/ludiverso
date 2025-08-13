const {
    isLogged,
    Datatime,
    connection,
    router,


} = require('./../../config/dependencies.js');





/// rutas para el juego del ahorcado
router.get('/ahorcado_intro', isLogged, (req, res) => {
    const select_areas = 'SELECT * FROM areas';
    connection.query(select_areas, [], (err, areas) => {
        if (err) {
            console.error('Error al obtener las áreas:', err);
            res.status(500).send('Error al obtener las áreas');
        } else {
            res.render('ahorcado_intro', { areas, session: req.session });
        }
    });
});

router.get('/ahorcado', isLogged, (req, res) => {
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
                , session: req.session
            });
        }
    });
});

router.post('/game-over-ahorcado', isLogged, (req, res) => {
    const { tiempo, aciertos, intentos_fallidos, victoria, palabra_jugada, id_area } = req.body;
    const id_us = req.session.usuario_id;
    const date = Datatime();

    // Primero guardar TODA partida en el historial
    const insertHistorialQuery = "INSERT INTO `historial_ahorcado` (`id_us`, `id_area`, `aciertos`, `intentos_fallidos`, `tiempo`, `victoria`, `palabra_jugada`, `fecha`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(insertHistorialQuery, [id_us, id_area, aciertos, intentos_fallidos, tiempo, victoria, palabra_jugada, date], (err, historialResult) => {
        if (err) {
            console.error('Error al guardar en historial:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar partida' });
        }

        // Solo actualizar ranking si es victoria
        if (victoria) {
            // Verificar si el usuario ya tiene una puntuación para esta área
            const checkQuery = "SELECT * FROM `ranking_ahorcado` WHERE id_us = ? AND id_area = ? AND victoria = 1";
            connection.query(checkQuery, [id_us, id_area], (err, existingRecords) => {
                if (err) {
                    console.error('Error al consultar ranking:', err);
                    return res.status(500).json({ success: false, message: 'Error al registrar puntuación' });
                }

                // Si el usuario ya tiene registros, verificamos si el nuevo es mejor
                if (existingRecords.length > 0) {
                    const bestRecord = existingRecords.reduce((best, current) => {
                        // Primero comparamos por aciertos (más es mejor)
                        if (current.aciertos > best.aciertos) return current;
                        if (current.aciertos < best.aciertos) return best;

                        // Si los aciertos son iguales, comparamos por tiempo (menos es mejor)
                        if (current.tiempo < best.tiempo) return current;
                        if (current.tiempo > best.tiempo) return best;

                        // Si el tiempo es igual, comparamos por intentos fallidos (menos es mejor)
                        return current.intentos_fallidos < best.intentos_fallidos ? current : best;
                    });

                    // Si la nueva puntuación es mejor, actualizamos el registro
                    if (aciertos > bestRecord.aciertos ||
                        (aciertos === bestRecord.aciertos && tiempo < bestRecord.tiempo) ||
                        (aciertos === bestRecord.aciertos && tiempo === bestRecord.tiempo && intentos_fallidos < bestRecord.intentos_fallidos)) {

                        const updateQuery = `
                            UPDATE ranking_ahorcado 
                            SET aciertos = ?, 
                                intentos_fallidos = ?, 
                                tiempo = ?, 
                                victoria = ?, 
                                palabra_jugada = ?, 
                                fecha = ?
                            WHERE id_us = ? AND id_area = ? AND victoria = 1
                        `;

                        connection.query(updateQuery,
                            [aciertos, intentos_fallidos, tiempo, victoria, palabra_jugada, date, id_us, id_area],
                            (err, result) => {
                                if (err) {
                                    console.error('Error al actualizar ranking:', err);
                                    return res.status(500).json({ success: false, message: 'Error al actualizar puntuación' });
                                }
                                res.json({ success: true, message: 'Puntuación actualizada correctamente' });
                            }
                        );
                    } else {
                        // Si la nueva puntuación no es mejor, mantenemos la existente
                        res.json({ success: true, message: 'Se mantiene la mejor puntuación anterior' });
                    }
                } else {
                    // Si no existe registro previo, insertamos uno nuevo
                    const insertQuery = "INSERT INTO `ranking_ahorcado` (`id_us`, `id_area`, `aciertos`, `intentos_fallidos`, `tiempo`, `victoria`, `palabra_jugada`, `fecha`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    connection.query(insertQuery,
                        [id_us, id_area, aciertos, intentos_fallidos, tiempo, victoria, palabra_jugada, date],
                        (err, result) => {
                            if (err) {
                                console.error('Error al insertar en ranking:', err);
                                return res.status(500).json({ success: false, message: 'Error al registrar puntuación' });
                            }
                            res.json({ success: true, message: 'Puntuación registrada correctamente' });
                        }
                    );
                }
            });
        } else {
            // Si no es victoria, solo responder que se guardó en el historial
            res.json({ success: true, message: 'Partida registrada en el historial' });
        }
    });
});

router.get('/ahorcado_ranking', isLogged, (req, res) => {
    const area = req.query.area;
    let query = `
        WITH RankedScores AS (
            SELECT 
                r.*,
                u.nombre_usuario,
                a.nombre as nombre_area,
                ROW_NUMBER() OVER (
                    PARTITION BY r.id_us, r.id_area 
                    ORDER BY r.aciertos DESC, r.tiempo ASC
                ) as rn
            FROM ranking_ahorcado r 
            JOIN usuarios u ON r.id_us = u.usuario_id 
            JOIN areas a ON r.id_area = a.materia_id
            WHERE r.victoria = 1
    `;

    const params = [];
    if (area) {
        query += ' AND r.id_area = ?';
        params.push(area);
    }

    query += `) 
        SELECT * FROM RankedScores 
        WHERE rn = 1 
        ORDER BY aciertos DESC, tiempo ASC`;

    // Primero obtenemos todas las áreas para el filtro
    connection.query('SELECT * FROM areas', (err, areas) => {
        if (err) {
            console.error('Error al obtener áreas:', err);
            res.status(500).send('Error al cargar el ranking');
            return;
        }

        // Luego obtenemos los datos del ranking
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al obtener ranking:', err);
                res.status(500).send('Error al cargar el ranking');
            } else {
                res.render('ahorcado_ranking', {
                    data_ahorcado: result,
                    areas: areas,
                    selectedArea: area,
                    area: area,
                    session: req.session
                });
            }
        });
    });
});

router.get('/next-word', isLogged, (req, res) => {
    const area = req.query.area;
    const completed = parseInt(req.query.completed);
    const usedWords = req.query.usedWords ? req.query.usedWords.split(',') : [];

    // Primero obtener el total de palabras para el área
    const countQuery = 'SELECT COUNT(*) as total FROM palabras_ahorcado WHERE materia_id = ?';
    connection.query(countQuery, [area], (err, countResult) => {
        if (err) {
            console.error('Error al contar palabras:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        const totalWords = countResult[0].total;

        if (completed >= totalWords) {
            // Ya completó todas las palabras del área
            res.json({ completed: true });
        } else {
            // Obtener la siguiente palabra aleatoria que no haya sido usada
            const wordQuery = `
                SELECT palabra, pista 
                FROM palabras_ahorcado 
                WHERE materia_id = ? 
                AND palabra NOT IN (?)
                ORDER BY RAND() 
                LIMIT 1
            `;

            connection.query(wordQuery, [area, usedWords], (err, wordResult) => {
                if (err) {
                    console.error('Error al obtener palabra:', err);
                    return res.status(500).json({ error: 'Error del servidor' });
                }

                if (wordResult.length === 0) {
                    // Si no hay más palabras disponibles
                    res.json({ completed: true });
                } else {
                    res.json({
                        completed: false,
                        palabra: wordResult[0].palabra,
                        pista: wordResult[0].pista
                    });
                }
            });
        }
    });
});



// Exporta todas las rutas definidas
module.exports = router;
