-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial data
INSERT INTO messages (content) VALUES 
  ('Welcome to our simple message board!'),
  ('This is running on Docker containers');
