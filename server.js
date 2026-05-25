const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/exercises', require('./routes/exercises'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Create HTTP server so Express and WebSocket share same port
const server = http.createServer(app);

// WebSocket on same port as Express
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('WS client connected');
  ws.on('message', (msg) => {
    // Relay to all other clients (app receives ESP32 data)
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === 1) client.send(msg.toString());
    });
  });
  ws.on('close', () => console.log('WS client disconnected'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`MongoDB connected`);
      console.log(`Server on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));