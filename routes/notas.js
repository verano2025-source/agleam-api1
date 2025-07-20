// routes/notas.js
const express = require('express');
const router = express.Router();
const notasController = require('../controllers/notasController');

// CRUD de notas
router.get('/', notasController.obtenerNotas);
router.post('/', notasController.crearNota);
router.put('/:id', notasController.editarNota);
router.delete('/:id', notasController.eliminarNota);

module.exports = router;
