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
const brevo = require('@getbrevo/brevo');
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
                    // let defaultClient = brevo.ApiClient.instance;

                    // let apiKey = defaultClient.authentications['api-key'];
                    // apiKey.apiKey = 'YOUR API KEY';

                    // let apiInstance = new brevo.TransactionalEmailsApi();
                    // let sendSmtpEmail = new brevo.SendSmtpEmail();

                    // sendSmtpEmail.subject = "My {{params.subject}}";
                    // sendSmtpEmail.htmlContent = "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
                    // sendSmtpEmail.sender = { "name": "John", "email": "example@example.com" };
                    // sendSmtpEmail.to = [
                    //     { "email": "example@brevo.com", "name": "sample-name" }
                    // ];
                    // sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
                    // sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
                    // sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


                    // apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                    //     console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                    // }, function (error) {
                    //     console.error(error);
                    // });

// Ruta GET para mostrar la página de recuperar contraseña
router.get('/recuperar-contrasena', async (req, res) => {
    res.render('recuperarContra', { 
        message: null 
    });
});

// Ruta POST para procesar la recuperación de contraseña
router.post('/recuperar-contrasena', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.render('recuperarContra', {
                message: {
                    type: 'error',
                    text: 'Por favor, ingresa tu correo electrónico.'
                }
            });
        }

        // Verificar si el email existe en la base de datos
        const checkEmailQuery = 'SELECT * FROM usuarios WHERE email = ?';
        connection.query(checkEmailQuery, [email], (err, results) => {
            if (err) {
                console.error('Error al verificar email:', err);
                return res.render('recuperarContra', {
                    message: {
                        type: 'error',
                        text: 'Error del servidor. Intenta nuevamente.'
                    }
                });
            }

            if (results.length === 0) {
                return res.render('recuperarContra', {
                    message: {
                        type: 'error',
                        text: 'No se encontró una cuenta con ese correo electrónico.'
                    }
                });
            }

            // Por ahora, solo confirmar que el email existe
            // En un entorno de producción, aquí enviarías un email con un enlace de recuperación
            
            res.render('recuperarContra', {
                message: {
                    type: 'success',
                    text: `Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada. (Nota: En desarrollo, el email no se envía realmente)`
                }
            });
        });

    } catch (error) {
        console.error('Error en recuperar contraseña:', error);
        res.render('recuperarContra', {
            message: {
                type: 'error',
                text: 'Error del servidor. Intenta nuevamente.'
            }
        });
    }
});


module.exports = router; // Exporta el router