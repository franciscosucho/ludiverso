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

router.get('/recuperar-contrasena', async (req, res) => {
 
    res.send('Página para recuperar contraseña');
});


module.exports = router; // Exporta el router