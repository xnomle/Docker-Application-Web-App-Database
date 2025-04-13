const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database
async function initializeDb() {
  try {
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
    // Retry after a delay
    setTimeout(initializeDb, 5000);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/messages', async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO messages (content) VALUES ($1) RETURNING *',
      [content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`);
  
  // Initialize database after a short delay to ensure database is ready
  setTimeout(initializeDb, 5000);
});
