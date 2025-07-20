const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'srv648.hstgr.io',                     // ← servidor de Hostinger
  user: 'u391167523_MKBC3123',                 // ← tu usuario MySQL
  password: 'Agleam$3123',              // ← tu contraseña de ese usuario
  database: 'u391167523_agleam',               // ← nombre de tu base de datos
});

module.exports = db;
