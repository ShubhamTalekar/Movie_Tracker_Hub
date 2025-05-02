const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:8081', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Required to allow cookies/session
}));

// Parse incoming JSON
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in prod
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/movies', async (req, res) => {
  try {
    const result = await require('./db').query('SELECT * FROM movies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching movies');
  }
});

app.post('/api/movies', async (req, res) => {
  const { title, description, genre, release_year, poster_url, type } = req.body;
  try {
    const result = await require('./db').query(
      `INSERT INTO movies (title, description, genre, release_year, poster_url, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, genre, release_year, poster_url, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding movie');
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await require('./db').query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (error) {
    res.status(500).send('DB connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
