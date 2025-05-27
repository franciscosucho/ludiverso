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
    if (ext === '.csv') {
      await importarCSV(file.path);
    } else if (ext === '.xlsx' || ext === '.xls') {
      await importarExcel(file.path);
    } else {
      return res.status(400).send('Formato no soportado.');
    }
    res.redirect('/dashboard'); // O tu vista principal
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

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', async () => {
        for (const { id_area, palabra, descrip } of rows) {
          await conn.query(
            'INSERT INTO wordle (id_area, palabra, descrip) VALUES (?, ?, ?)',
            [id_area, palabra, descrip]
          );
        }
        conn.release();
        resolve();
      })
      .on('error', reject);
  });
}

async function importarExcel(filePath) {
  const conn = await pool.getConnection();
  const workbook = xlsx.readFile(filePath);
  const datos = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  for (const { id_area, palabra, descrip } of datos) {
    await conn.query(
      'INSERT INTO wordle (id_area, palabra, descrip) VALUES (?, ?, ?)',
      [id_area, palabra, descrip]
    );
  }
  conn.release();
}

module.exports = router;
