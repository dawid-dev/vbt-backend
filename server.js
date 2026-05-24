const { WebSocketServer } = require('ws');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/exercises', require('./routes/exercises'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
    // After app.listen inside mongoose.connect:
const wss = new WebSocketServer({ port: 3001 });
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (msg) => {
    // Relay ESP32 messages to all app clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) client.send(msg.toString());
    });
  });
});
  })
  .catch(err => console.error(err));