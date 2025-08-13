const {
    hashPassword,
    connection,
    router,
   

} = require('./../config/dependencies.js');


router.get('/register', (req, res) => {
    res.render('register', { session: req.session });
})


router.post('/registrar', async (req, res) => {
    try {
        const { nombre_us, apellido_us, nombre_usuario_us, email_us, recibir_nov, password_us, tipo_daltonismo } = req.body;
        console.log("asda", recibir_nov)
        let bol_recibir = 0;
        if (recibir_nov === 'on') {
            bol_recibir = 1;
        }


        const hash = await hashPassword(password_us);
        const insert_usuario = "INSERT INTO usuarios ( nombre , apellido , nombre_usuario , email ,recibir_nov, contraseña, rol, daltonismo) VALUES (?,?,?,?,?,?,?,?)";

        connection.query(insert_usuario, [nombre_us, apellido_us, nombre_usuario_us, email_us, bol_recibir, hash, "alumno", tipo_daltonismo], (err, result) => {
            if (err) {

                if (err.code === 'ER_DUP_ENTRY') {

                    console.error('Error al registrarse: El email ya está registrado.', err);
                    res.render('register', { error: 'El email ingresado ya se encuentra registrado. Por favor, utilice otro.' });
                } else {
                    // Otros errores de base de datos
                    console.error('Error al registrarse en la base de datos:', err);
                    res.render('register', { error: 'Ocurrió un error al intentar registrar el usuario. Inténtelo de nuevo.' });
                }
            } else {
                // Usar directamente el ID del usuario recién insertado
                req.session.usuario_id = result.insertId;
                req.session.nombre_us = nombre_us
                req.session.apellido_us = apellido_us
                req.session.nombre_usuario_us = nombre_usuario_us
                req.session.email_us = email_us
                req.session.password_us = password_us
                req.session.rol_us = "alumno"
                req.session.daltonismo = result.tipo_daltonismo;
                req.session.user_sesion = true;
                res.redirect('/index');
            }
        })

    } catch (err) {
        console.error('Error en la consulta:', err);
        res.render('register', { error: 'Ocurrio un error al monento de registrase' });
    }


})

// Exporta todas las rutas definidas
module.exports = router;
