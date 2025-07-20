const express = require('express');
const router = express.Router();
const pool = require('../db'); // tu conexión MySQL

// Obtener perfil de apicultor por nombre
router.get('/apicultor/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    // Buscar apicultor
    const [apicultorRows] = await pool.query(
      'SELECT * FROM apicultors WHERE nombre = ?',
      [nombre]
    );
    if (apicultorRows.length === 0) {
      return res.status(404).json({ error: 'Apicultor no encontrado' });
    }

    const apicultor = apicultorRows[0];

    // Obtener UPPs
    const [upps] = await pool.query(`
      SELECT u.* FROM apicultor_upp au
      JOIN upps u ON au.upp_id = u.id
      WHERE au.apicultor_id = ?
    `, [apicultor.id]);

    // Obtener Apiarios
    const [apiarios] = await pool.query(`
      SELECT a.* FROM apicultor_apiario aa
      JOIN apiarios a ON aa.apiario_id = a.id
      WHERE aa.apicultor_id = ?
    `, [apicultor.id]);

    res.json({
      apicultor,
      upps,
      apiarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
