const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const createApp = require('./app');
let io;
const app = createApp(() => io);
const server = createServer(app);
io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
io.on('connection', socket => {
  console.log('Socket connected:', socket.id);

  socket.on('join', articleAuthorId => {
    socket.join(articleAuthorId);
    console.log(`User ${socket.id} joined room ${articleAuthorId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));
