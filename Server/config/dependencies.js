const express = require('express');
const session = require('express-session');
const connection = require('./../config/db.js');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');
const transporter = require('./../config/nodemailer.js');
const flash = require('connect-flash');
require('dotenv').config();

const router = express.Router();
const upload_nov = multer({ dest: 'uploads/' }); // Carpeta temporal

const isLogged = (req, res, next) => {
    if (!req.session.usuario_id) {
        console.log('Usuario no autenticado - No hay ID de usuario en la sesión');
        return res.redirect('/login');
    }
    console.log('Usuario autenticado - ID:', req.session.usuario_id);
    next();
};
function Datatime() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Funcion para hashear una contraseña
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

// Función para comparar una contraseña con su hash
async function verifyPassword(plainPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        throw error;
    }
}


module.exports = {
    flash,
    verifyPassword,
    hashPassword,
    Datatime,
    isLogged,
    express,
    session,
    connection,
    multer,
    fs,
    path,
    sharp,
    crypto,
    transporter,
    router,
    upload_nov
};