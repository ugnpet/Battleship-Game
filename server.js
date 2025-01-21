const express = require('express');
const app = express();
const PORT = 3001;
const gameRoutes = require('./routes/gameRoutes');

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the server!' });
  });

app.use('/api/game', gameRoutes);
