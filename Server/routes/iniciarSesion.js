


const {
    connection,
    router,
    verifyPassword
} = require('./../config/dependencies.js');


router.post('/iniciar_sesion', async (req, res) => {
    try {
        const { user_name, password } = req.body;

        // Si no se envían credenciales,  renderiza la vista sin error
        if (!user_name?.trim() || !password?.trim()) {

            return res.render('login.ejs', { error: 'Por favor, completa todos los campos.' });
        }

        const query_ini = 'SELECT * FROM `usuarios` WHERE nombre_usuario =?';
        const [userResults] = await connection.promise().query(query_ini, [user_name]);

        if (userResults.length === 0) {
            return res.render('login.ejs', { error: 'Usuario o contraseña incorrectos' });
        }

        const hashedPassword = userResults[0].contraseña;
        const isMatch = await verifyPassword(password, hashedPassword);
        if (isMatch) {
            req.session.usuario_id = userResults[0].usuario_id;
            req.session.nombre_us = userResults[0].nombre;
            req.session.apellido_us = userResults[0].apellido;
            req.session.nombre_usuario_us = userResults[0].nombre_usuario;
            req.session.email_us = userResults[0].email;
            req.session.password_us = userResults[0].contraseña;
            req.session.rol_us = userResults[0].rol;
            req.session.daltonismo = userResults[0].daltonismo;
            res.cookie('daltonismo', userResults[0].daltonismo, { maxAge: 31536000000, httpOnly: false, path: '/' });

            req.session.user_sesion = true;
            if (req.session.rol_us == "root") {
                req.session.root = true;
                return res.redirect('/dashboard');

            } else {
                req.session.root = false;
                return res.redirect('/index');
            }

        } else {
            return res.render('login.ejs', { error: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        console.error('Error en inicio de sesión:', err);
        return res.render('login.ejs', { error: 'Error al verificar los datos' });
    }

})


// Exporta todas las rutas definidas
module.exports = router;