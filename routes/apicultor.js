const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a la base de datos

router.get('/perfil/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM apicultors WHERE nombre = ?', [nombre]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Apicultor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
});

module.exports = router;
