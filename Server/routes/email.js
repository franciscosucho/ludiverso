// server/routes/Emails.js
const express = require('express');
const router = express.Router();
const connection = require('./../config/db.js');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const upload_nov = multer({ dest: 'uploads/' }); // Carpeta temporal
const sharp = require("sharp")
const crypto = require('crypto');
const transporter = require('../config/nodemailer.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const isLogged = (req, res, next) => {
    if (!req.session.usuario_id) {
        console.log('Usuario no autenticado - No hay ID de usuario en la sesión');
        return res.redirect('/login');
    }
    console.log('Usuario autenticado - ID:', req.session.usuario_id);
    next();
};

// Middleware
const root_verificar = (req, res, next) => {
    if (req.session.root === true) {
        next();
    } else {
        res.redirect('/');
    }
};



router.get('/recuperar_contra_view', async (req, res) => {
    res.render('recuperar_contra_view')
});

// =========================================================================
//  Procesar la solicitud de recuperación (generar token y enviar email)

router.post('/recuperar-contra-post', (req, res) => { 
    const { recup_email } = req.body;
    console.log(recup_email);

    if (!recup_email) {
        return res.render('recuperar_contra_view', { error: 'Por favor, ingrese su correo electrónico.', message: null });
    }

    let query_select_user = 'SELECT `usuario_id`, `email` FROM `usuarios` WHERE email=?';
    connection.query(query_select_user, [recup_email], (err, result_users) => {
        if (err) {
            console.error('Error al buscar usuario para recuperación:', err);
            return res.status(500).render('recuperar_contra_view', {
                error: 'Ocurrió un error en el servidor. Inténtelo de nuevo más tarde.',
                message: null
            });
        }

        
        if (result_users.length === 0) {
            console.log(`Intento de recuperación para email no existente: ${recup_email}`);
            return res.render('recuperar_contra_view', {
                message: 'Si el correo electrónico existe en nuestro sistema, recibirá un enlace para restablecer su contraseña.',
                error: null
            });
        }

        
        const userId = result_users[0].usuario_id;
        console.log("ID de usuario para token:", userId);

        // Generar un token JWT único
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

      
        let query_update_token = 'UPDATE usuarios SET reset_password_token = ?, reset_password_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE usuario_id = ?';
        connection.query(query_update_token, [token, userId], (err_update, result_update) => {
            if (err_update) {
                console.error('Error al actualizar token en la DB:', err_update);
                return res.status(500).render('recuperar_contra_view', {
                    error: 'Ocurrió un error al guardar el token. Inténtelo de nuevo más tarde.',
                    message: null
                });
            }

           
            const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
            console.log("Enlace de restablecimiento:", resetLink);

         
            transporter.sendMail({
                from: '"Ludiverso" <no-reply@ludiverso.com>',
                to: recup_email,
                subject: "Recuperación de Contraseña - Ludiverso",
                html: `
                    <p>Hola,</p>
                    <p>Has solicitado restablecer tu contraseña para Ludiverso. Haz clic en el siguiente enlace para continuar:</p>
                    <p><a href="${resetLink}">Restablecer mi contraseña</a></p>
                    <p>Este enlace expirará en 1 hora.</p>
                    <p>Si no solicitaste esto, puedes ignorar este correo.</p>
                    <p>Saludos,<br>El equipo de Ludiverso</p>
                `,
            })
                .then(info => {
                    console.log('Correo enviado:', info.messageId);
                    res.render('recuperar_contra_view', {
                        message: 'Si el correo electrónico existe en nuestro sistema, recibirá un enlace para restablecer su contraseña en su bandeja de entrada.',
                        error: null
                    });
                })
                .catch(email_err => {
                    console.error('Error al enviar correo electrónico:', email_err);
                   
                    res.render('recuperar_contra_view', {
                        error: 'Ocurrió un error al enviar el correo. Por favor, inténtelo de nuevo.',
                        message: null
                    });
                });
        });
    });
});


// =========================================================================
//  Mostrar formulario para restablecer la contraseña (validar token)

router.get('/reset-password', (req, res) => { // ¡QUITAMOS ASYNC AQUÍ!
    const { token } = req.query;

    if (!token) {
        return res.render('reset-password', { error: 'Token no proporcionado.', message: null, token: null });
    }

    let query_check_token = 'SELECT `usuario_id`, `email` FROM `usuarios` WHERE reset_password_token = ? AND reset_password_expires > NOW()';
    connection.query(query_check_token, [token], (err, result_users) => {
        if (err) {
            console.error('Error al verificar token en la DB:', err);
            return res.status(500).render('reset-password', {
                error: 'Ocurrió un error al verificar su token. Inténtelo de nuevo.',
                message: null,
                token: null
            });
        }

        if (result_users.length === 0) {
            return res.render('reset-password', { error: 'El token de restablecimiento de contraseña es inválido o ha expirado.', message: null, token: null });
        }

        // Si el token es válido, mostrar el formulario para ingresar nueva contraseña
        res.render('reset-password', { error: null, message: null, token: token });
    });
});

// =========================================================================
//  Procesar la nueva contraseña

router.post('/reset-password', async (req, res) => { 
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
        return res.render('reset-password', { error: 'Por favor, complete todos los campos.', message: null, token: token });
    }

    if (password !== confirmPassword) {
        return res.render('reset-password', { error: 'Las contraseñas no coinciden.', message: null, token: token });
    }

    if (password.length < 6) { 
        return res.render('reset-password', { error: 'La contraseña debe tener al menos 6 caracteres.', message: null, token: token });
    }

  
    let query_verify_token = 'SELECT `usuario_id`, `email` FROM `usuarios` WHERE reset_password_token = ? AND reset_password_expires > NOW()';
    connection.query(query_verify_token, [token], (err_verify, result_users) => {
        if (err_verify) {
            console.error('Error al verificar token en la DB para restablecimiento:', err_verify);
            return res.status(500).render('reset-password', {
                error: 'Ocurrió un error al verificar su token. Inténtelo de nuevo.',
                message: null,
                token: token
            });
        }

        if (result_users.length === 0) {
            return res.render('reset-password', { error: 'El token de restablecimiento de contraseña es inválido o ha expirado. Por favor, solicite uno nuevo.', message: null, token: null });
        }

        const userId = result_users[0].usuario_id;

        hashPassword(password)
            .then(hashedPassword => {
                // Actualizar la contraseña del usuario y eliminar/invalidar el token
                let query_update_password = 'UPDATE usuarios SET contraseña = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE usuario_id = ?';
                connection.query(query_update_password, [hashedPassword, userId], (err_update_pass, result_update_pass) => {
                    if (err_update_pass) {
                        console.error('Error al actualizar contraseña en la DB:', err_update_pass);
                        return res.status(500).render('reset-password', {
                            error: 'Ocurrió un error al restablecer su contraseña. Inténtelo de nuevo.',
                            message: null,
                            token: token
                        });
                    }

                    res.render('login', { message: 'Su contraseña ha sido restablecida exitosamente. Ahora puede iniciar sesión con su nueva contraseña.', error: null });
                });
            })
            .catch(hash_err => {
                console.error('Error al hashear contraseña:', hash_err);
                res.render('reset-password', {
                    error: 'Ocurrió un error al procesar su contraseña. Inténtelo de nuevo.',
                    message: null,
                    token: token
                });
            });
    });
});

module.exports = router;



async function hashPassword(plainPassword) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        throw error;
    }
}