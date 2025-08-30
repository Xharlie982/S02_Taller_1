const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Salud
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'node-sqlite-api', ts: new Date().toISOString() });
});

// Listar todos
app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener por id
app.get('/api/todos/:id', (req, res) => {
  db.get('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

// Crear
app.post('/api/todos', (req, res) => {
  const { title, done = 0 } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title is required' });

  db.run('INSERT INTO todos (title, done) VALUES (?, ?)', [title, done ? 1 : 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, done });
  });
});

// Actualizar
app.put('/api/todos/:id', (req, res) => {
  const { title, done } = req.body || {};
  db.run(
    'UPDATE todos SET title = COALESCE(?, title), done = COALESCE(?, done) WHERE id = ?',
    [title ?? null, done ?? null, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Eliminar
app.delete('/api/todos/:id', (req, res) => {
  db.run('DELETE FROM todos WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`API escuchando en http://localhost:${PORT}`));
