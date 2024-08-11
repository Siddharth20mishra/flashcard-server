const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'flashcards_db',
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Get all flashcards
app.get('/flashcards', (req, res) => {
  const query = 'SELECT * FROM flashcards';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new flashcard
app.post('/flashcards', (req, res) => {
  const { question, answer } = req.body;
  const query = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
  db.query(query, [question, answer], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, question, answer });
  });
});

// Update a flashcard
app.put('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  const query = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
  db.query(query, [question, answer, id], err => {
    if (err) throw err;
    res.json({ message: 'Flashcard updated' });
  });
});

// Delete a flashcard
app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM flashcards WHERE id = ?';
  db.query(query, [id], err => {
    if (err) throw err;
    res.json({ message: 'Flashcard deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
