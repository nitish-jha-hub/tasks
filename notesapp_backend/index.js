import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3011;

app.use(express.json()); // enable json body parsing
app.use(cors());   // enable cors for all requests
// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '5233',
  database: 'notesapp'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// handle landing page
app.get('/', (req, res) => {
  res.send('Welcome to the Notes Backend server');
});

// Route to get all notes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM Notes', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// add a new note
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO Notes (title, content) VALUES (?, ?)',
    [title, content],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json({success: true,msg:'Note added successfully'});
    }
  );
});

// delete a note
app.delete('/notes/:id', (req, res) => {
  console.log("fn is called")
  const { id } = req.params;
  db.query('DELETE FROM Notes WHERE NoteId = ?', [id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err);
    }
    res.send('Note deleted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
