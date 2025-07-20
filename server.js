require('dotenv').config(); // ✅ Esto carga las variables del archivo .env

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // 👈 por si usas PORT en .env también

// Middleware
app.use(cors());
app.use(express.json()); // ✅ usar esto en lugar de body-parser

// Rutas
const authRoutes = require('./routes/auth');
const apicultorRoutes = require('./routes/apicultor');
const perfilRoutes = require('./routes/perfil');
const apiariosRoutes = require('./routes/apiarios');
const notasRoutes = require('./routes/notas');

app.use('/api', authRoutes);
app.use('/api', apicultorRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/apiarios', apiariosRoutes);
app.use('/api/notas', notasRoutes);

// Iniciar servidor

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

