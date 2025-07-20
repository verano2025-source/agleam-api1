const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ Obtener todos los apiarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM apiarios');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener apiarios:', error);
    res.status(500).json({ error: 'Error al obtener apiarios' });
  }
});

// ✅ Agregar un apiario
router.post('/', async (req, res) => {
  try {
    const { codigo, nombre, ruta, ubicacion } = req.body;

    if (!codigo || !nombre || !ruta || !ubicacion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO apiarios (codigo, nombre, ruta, ubicacion) VALUES (?, ?, ?, ?)',
      [codigo, nombre, ruta, ubicacion]
    );

    res.status(200).json({ id: result.insertId, message: 'Apiario creado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'El código ya existe. Usa uno diferente.' });
    } else {
      console.error('❌ Error al crear apiario:', error);
      res.status(500).json({ error: 'Error al crear apiario' });
    }
  }
});

// ✅ Actualizar un apiario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, ruta, ubicacion } = req.body;

    if (!codigo || !nombre || !ruta || !ubicacion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const [result] = await pool.query(
      'UPDATE apiarios SET codigo = ?, nombre = ?, ruta = ?, ubicacion = ? WHERE id = ?',
      [codigo, nombre, ruta, ubicacion, id]
    );

    res.status(200).json({ message: 'Apiario actualizado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'El código ya existe. Usa uno diferente.' });
    } else {
      console.error('❌ Error al actualizar apiario:', error);
      res.status(500).json({ error: 'Error al actualizar apiario' });
    }
  }
});

// ✅ Eliminar un apiario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM apiarios WHERE id = ?', [id]);

    res.status(200).json({ message: 'Apiario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar apiario:', error);
    res.status(500).json({ error: 'Error al eliminar apiario' });
  }
});

module.exports = router;
