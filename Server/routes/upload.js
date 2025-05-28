const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ludiverso'
});

router.post('/', upload.single('archivo'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('Archivo no encontrado.');

    const ext = path.extname(file.originalname).toLowerCase();

    try {
        let resultado;
        if (ext === '.csv') {
            resultado = await importarCSV(file.path);
        } else if (ext === '.xlsx' || ext === '.xls') {
            resultado = await importarExcel(file.path);
        } else {
            return res.status(400).send('Formato no soportado.');
        }

        res.send(`Importación finalizada. Palabras insertadas: ${resultado.insertadas}. Duplicadas ignoradas: ${resultado.duplicadas}.`);
    } catch (error) {
        console.error('Error al importar:', error);
        res.status(500).send('Error al importar datos');
    } finally {
        fs.unlinkSync(file.path);
    }
});

async function importarCSV(filePath) {
    const conn = await pool.getConnection();
    const rows = [];
    let insertadas = 0;
    let duplicadas = 0;

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', row => rows.push(row))
            .on('end', async () => {
                try {
                    for (const { id_area, palabra, descrip } of rows) {
                        const [result] = await conn.query(
                            'SELECT COUNT(*) AS count FROM wordle WHERE palabra = ? AND id_area = ?',
                            [palabra, id_area]
                        );
                        if (result[0].count === 0) {
                            await conn.query(
                                'INSERT INTO wordle (id_area, palabra, descrip) VALUES (?, ?, ?)',
                                [id_area, palabra, descrip]
                            );
                            insertadas++;
                        } else {
                            duplicadas++;
                        }
                    }
                    resolve({ insertadas, duplicadas });
                } catch (err) {
                    reject(err);
                } finally {
                    conn.release();
                }
            })
            .on('error', reject);
    });
}

async function importarExcel(filePath) {
    const conn = await pool.getConnection();
    const workbook = xlsx.readFile(filePath);
    const datos = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let insertadas = 0;
    let duplicadas = 0;

    try {
        for (const { id_area, palabra, descrip } of datos) {
            const [result] = await conn.query(
                'SELECT COUNT(*) AS count FROM wordle WHERE palabra = ? AND id_area = ?',
                [palabra, id_area]
            );
            if (result[0].count === 0) {
                await conn.query(
                    'INSERT INTO wordle (id_area, palabra, descrip) VALUES (?, ?, ?)',
                    [id_area, palabra, descrip]
                );
                insertadas++;
            } else {
                duplicadas++;
            }
        }
        return { insertadas, duplicadas };
    } finally {
        conn.release();
    }
}

module.exports = router;
