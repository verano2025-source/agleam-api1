const db = require('../db');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { usuario, password } = req.body;
  console.log('🟡 Intento de login:', usuario);

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // Reemplazar $2y$ por $2b$ si viene de Laravel u otro generador
    const hashCompatible = user.password.replace('$2y$', '$2b$');

    const isMatch = await bcrypt.compare(password, hashCompatible);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    console.log('✅ Login exitoso para:', user.usuario);

    res.json({
      usuario_id: user.id,
      nombre: user.nombre,
      usuario: user.usuario,
      rol: user.rol,
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };
