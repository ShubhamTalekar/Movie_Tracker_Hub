const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:5173',
  'https://movie-tracker-hub.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/api/auth', authRoutes);

app.get('/api/movies', async (req, res) => {
  const pool = require('./db');
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err.stack);
    res.status(500).send('Error fetching movies');
  }
});

app.post('/api/movies', async (req, res) => {
  const pool = require('./db');
  const { title, description, genre, release_year, poster_url, type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO movies (title, description, genre, release_year, poster_url, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, genre, release_year, poster_url, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding movie:', err.stack);
    res.status(500).send('Error adding movie');
  }
});

app.get('/api/test-db', async (req, res) => {
  const pool = require('./db');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (error) {
    console.error('DB connection error in /api/test-db:', error.stack);
    res.status(500).send('DB connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});