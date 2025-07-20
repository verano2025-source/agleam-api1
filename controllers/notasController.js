// controllers/notasController.js
const db = require('../db');

const obtenerNotas = async (req, res) => {
  const { usuario_id, rol } = req.query;

  try {
    let query = 'SELECT notas.*, usuarios.nombre FROM notas JOIN usuarios ON notas.usuario_id = usuarios.id';
    let params = [];

    if (rol !== 'admin') {
      query += ' WHERE usuario_id = ?';
      params.push(usuario_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener notas:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const crearNota = async (req, res) => {
  const { usuario_id, contenido } = req.body;

  if (!usuario_id || !contenido) {
    return res.status(400).json({ error: 'usuario_id y contenido son obligatorios' });
  }

  try {
    const [userRows] = await db.query('SELECT rol FROM usuarios WHERE id = ?', [usuario_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const rol = userRows[0].rol;
    if (rol === 'admin' || rol === 'administrador') {
      return res.status(403).json({ error: 'Los administradores no pueden crear notas' });
    }

    const [result] = await db.query(
      'INSERT INTO notas (usuario_id, contenido) VALUES (?, ?)',
      [usuario_id, contenido]
    );

    res.status(201).json({ message: 'Nota creada', id: result.insertId });
  } catch (err) {
    console.error('❌ Error al crear nota:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const editarNota = async (req, res) => {
  const { id } = req.params;
  const { contenido, usuario_id } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM notas WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
    if (rows.length === 0) {
      return res.status(403).json({ message: 'No autorizado para editar esta nota' });
    }

    await db.query('UPDATE notas SET contenido = ?, updated_at = NOW() WHERE id = ?', [contenido, id]);
    res.json({ message: 'Nota actualizada' });
  } catch (err) {
    console.error('❌ Error al editar nota:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const eliminarNota = async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM notas WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
    if (rows.length === 0) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta nota' });
    }

    await db.query('DELETE FROM notas WHERE id = ?', [id]);
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    console.error('❌ Error al eliminar nota:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerNotas,
  crearNota,
  editarNota,
  eliminarNota,
};
