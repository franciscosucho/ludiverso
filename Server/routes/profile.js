// server/routes/dashboard.js
const express = require('express');
const session = require('express-session');
const router = express.Router();
const connection = require('./../config/db.js');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const upload_nov = multer({ dest: 'uploads/' }); // Carpeta temporal
const sharp = require("sharp")
const crypto = require('crypto');
require('dotenv').config();


const isLogged = (req, res, next) => {
    if (!req.session.usuario_id) {
        console.log('Usuario no autenticado - No hay ID de usuario en la sesión');
        return res.redirect('/login');
    }
    // console.log('Usuario autenticado - ID:', req.session.usuario_id);
    next();
};

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



// Ruta para ver el perfil de usuario
router.get('/profile', isLogged, async (req, res) => {
    try {
        const userId = req.session.usuario_id;
        // console.log('ID de usuario de la sesión:', userId);

        // Obtener datos del usuario
        const userQuery = "SELECT * FROM usuarios WHERE usuario_id = ?";
        connection.query(userQuery, [userId], (err, userResult) => {
            if (err) {
                console.error('Error al obtener datos del usuario:', err);
                return res.status(500).send('Error al obtener datos del usuario');
            }

            if (!userResult || userResult.length === 0) {
                console.error('Usuario no encontrado');
                return res.status(404).send('Usuario no encontrado');
            }

            // Obtener estadísticas básicas del usuario (todas las partidas)
            const statsQuery = `
                SELECT 
                    -- Total de juegos jugados (todas las partidas, ganadas y perdidas)
                    (
                        COALESCE((SELECT COUNT(*) FROM estadisticas WHERE usuario_id = ?), 0) +
                        COALESCE((SELECT COUNT(*) FROM historial_ahorcado WHERE id_us = ?), 0) +
                        COALESCE((SELECT COUNT(*) FROM historial_wordle WHERE id_us = ?), 0) +
                        COALESCE((SELECT COUNT(*) FROM niveles_us WHERE id_us = ?), 0)
                    ) as juegosJugados,
                    
                    -- Total de puntos (solo de partidas ganadas)
                    (
                        COALESCE((SELECT SUM(puntaje_total) FROM estadisticas WHERE usuario_id = ?), 0) +
                        COALESCE((SELECT SUM(aciertos) FROM historial_ahorcado WHERE id_us = ? AND victoria = 1), 0) +
                        COALESCE((SELECT SUM(aciertos) FROM historial_wordle WHERE id_us = ?), 0)
                    ) as puntosTotales
            `;

            // console.log('Ejecutando consulta de estadísticas generales para usuario:', userId);
            connection.query(statsQuery, [userId, userId, userId, userId, userId, userId, userId], (err, statsResult) => {
                if (err) {
                    console.error('Error al obtener estadísticas:', err);
                    return res.status(500).send('Error al obtener estadísticas');
                }

                // console.log('Resultado de estadísticas generales:', statsResult);

                // Agregar ranking simple
                const stats = statsResult[0] || { juegosJugados: 0, puntosTotales: 0 };
                stats.ranking = stats.puntosTotales > 0 ? 'Activo' : 'Nuevo';

                // console.log('Estadísticas finales para renderizar:', stats);

                res.render('profile', {
                    user: userResult[0],
                    stats: stats,
                    session: req.session
                });
            });
        });
    } catch (err) {
        console.error('Error al cargar el perfil:', err);
        res.status(500).send('Error al cargar el perfil');
    }
});

// Ruta de prueba para verificar conexión
router.get('/test-stats', isLogged, (req, res) => {
    const userId = req.session.usuario_id;

    // Probar consulta de estadísticas generales
    const statsQuery = `
        SELECT 
            (
                COALESCE((SELECT COUNT(*) FROM estadisticas WHERE usuario_id = ?), 0) +
                COALESCE((SELECT COUNT(*) FROM historial_ahorcado WHERE id_us = ?), 0) +
                COALESCE((SELECT COUNT(*) FROM historial_wordle WHERE id_us = ?), 0) +
                COALESCE((SELECT COUNT(*) FROM niveles_us WHERE id_us = ?), 0)
            ) as juegosJugados,
            (
                COALESCE((SELECT SUM(puntaje_total) FROM estadisticas WHERE usuario_id = ?), 0) +
                COALESCE((SELECT SUM(aciertos) FROM historial_ahorcado WHERE id_us = ? AND victoria = 1), 0) +
                COALESCE((SELECT SUM(aciertos) FROM historial_wordle WHERE id_us = ?), 0)
            ) as puntosTotales
    `;

    connection.query(statsQuery, [userId, userId, userId, userId, userId, userId, userId], (err, result) => {
        if (err) {
            console.error('Error en consulta de prueba:', err);
            return res.status(500).json({ error: 'Error en consulta' });
        }

        res.json({
            message: 'Ruta funcionando',
            userId: userId,
            stats: result[0] || { juegosJugados: 0, puntosTotales: 0 }
        });
    });
});

// Ruta para obtener estadísticas detalladas por juego
router.get('/profile-stats', isLogged, (req, res) => {
    const userId = req.session.usuario_id;
    // console.log('Obteniendo estadísticas para usuario:', userId);

    // Consultas para cada juego
    const memoryQuery = "SELECT COUNT(*) as niveles_completados, COALESCE(SUM(puntaje_total), 0) as puntaje_total FROM estadisticas WHERE usuario_id = ?";
    const wordleQuery = "SELECT COALESCE(MAX(aciertos), 0) as mejor_aciertos, COALESCE(MIN(tiempo), 0) as mejor_tiempo FROM historial_wordle WHERE id_us = ?";
    const ahorcadoQuery = "SELECT COUNT(*) as victorias, COALESCE(MIN(tiempo), 0) as mejor_tiempo FROM historial_ahorcado WHERE id_us = ? AND victoria = 1";
    const puzzleQuery = "SELECT COUNT(*) as niveles_completados FROM niveles_us WHERE id_us = ? AND id_juego = 2";

    // Ejecutar todas las consultas en paralelo
    Promise.all([
        new Promise((resolve, reject) => {
            connection.query(memoryQuery, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result[0] || { niveles_completados: 0, puntaje_total: 0 });
            });
        }),
        new Promise((resolve, reject) => {
            connection.query(wordleQuery, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result[0] || { mejor_aciertos: 0, mejor_tiempo: 0 });
            });
        }),
        new Promise((resolve, reject) => {
            connection.query(ahorcadoQuery, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result[0] || { victorias: 0, mejor_tiempo: 0 });
            });
        }),
        new Promise((resolve, reject) => {
            connection.query(puzzleQuery, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result[0] || { niveles_completados: 0 });
            });
        })
    ])
        .then(([memory, wordle, ahorcado, puzzle]) => {
            const response = {
                memory: {
                    niveles_completados: memory.niveles_completados,
                    puntaje_total: memory.puntaje_total
                },
                wordle: {
                    mejor_aciertos: wordle.mejor_aciertos,
                    mejor_tiempo: wordle.mejor_tiempo
                },
                ahorcado: {
                    victorias: ahorcado.victorias,
                    mejor_tiempo: ahorcado.mejor_tiempo
                },
                puzzle: {
                    niveles_completados: puzzle.niveles_completados,
                    mejor_tiempo: 0
                }
            };

            // console.log('Estadísticas completas obtenidas:', response);
            res.json(response);
        })
        .catch(err => {
            console.error('Error al obtener estadísticas:', err);
            res.status(500).json({ error: 'Error al obtener estadísticas' });
        });
});

// Ruta para actualizar el perfil
router.post('/actualizar_perfil', isLogged, async (req, res) => {

    try {
        const { usuario_id, nombre, apellido, email, password, daltonismo } = req.body;

        let query = "UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, daltonismo=?";
        const params = [nombre, apellido, email, daltonismo];

        // Solo actualizar contraseña si se proporciona una nueva
        if (password && password.trim() !== '') {
            query += ", contraseña = ?";
            params.push(password);
        }

        query += " WHERE usuario_id = ?";
        params.push(usuario_id);

        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al actualizar el perfil:', err);
                return res.status(500).send('Error al actualizar el perfil');
            }

            // Actualizar datos de sesión
            req.session.nombre_us = nombre;
            req.session.apellido_us = apellido;
            req.session.daltonismo = daltonismo
            res.cookie('daltonismo', daltonismo, { maxAge: 31536000000, httpOnly: false, path: '/' });
            res.redirect('/profile');
        });
    } catch (err) {
        console.error('Error al actualizar el perfil:', err);
        res.status(500).send('Error al actualizar el perfil');
    }
});


// Exporta todas las rutas definidas
module.exports = router;
