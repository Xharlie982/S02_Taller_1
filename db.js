const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Archivo de base de datos en la carpeta del proyecto
const dbFile = path.join(__dirname, 'app.db');

// Abre o crea la BD
const db = new sqlite3.Database(dbFile);

// Esquema inicial
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
});

module.exports = db;
